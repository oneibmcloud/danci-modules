//Required dependencies
var amqp = require('amqplib/callback_api');
var NodeRSA = require('node-rsa');

amqp.connect(process.env.RABBITMQ_URL, {
    ca: [process.env.RABBITMQ_CERT]
}, function(err, conn) {
    if (err)
        return console.log(err);

    console.log('Connected to RabbitMQ Server');

    conn.createChannel(function(err, ch) {
        if (err)
            return console.log(err);

        console.log('Created RabbitMQ Channel');

        var ex = 'jenkins_queue';

        ch.assertExchange(ex, 'fanout', {durable: true});
        ch.assertQueue('', {
            exclusive: true
        }, function(err, q) {
            ch.bindQueue(q.queue, ex, '');
            ch.consume(q.queue, function(jenkins_info_encrypted) {

                var key = new NodeRSA(process.env.JENKINS_PRIVATE_KEY);

                try {
                    key.decrypt(jenkins_info_encrypted.content.toString(), 'utf8');
                } catch (e) {
                    return;
                }

                var jenkins_info = key.decrypt(jenkins_info_encrypted.content.toString(), 'utf8');

                jenkins_service(JSON.parse(jenkins_info), conn);
                ch.ack(jenkins_info_encrypted);

            }, {noAck: false});
        });
    });
});

function jenkins_service(jenkins_info, conn) {
    var jenkins = require('jenkins')({baseUrl: jenkins_info.url, crumbIssuer: true});

    //Trigger new build
    jenkins.job.build({
        'name': jenkins_info.job_name,
        'token': jenkins_info.job_token
    }, function(err, buildNumber) {
        if (err) {
            var key = new NodeRSA(process.env.JENKINS_PRIVATE_KEY);
            var error_encrypted = key.encryptPrivate(err, 'base64');

            conn.createChannel(function(err, ch) {
                if (err)
                    return console.log(err);

                console.log('Created RabbitMQ Channel 2');

                var ex = 'jenkins_info';

                ch.assertExchange(ex, 'fanout', {durable: true});
                ch.publish(ex, '', new Buffer(error_encrypted));
            });
            console.log(err);
        } else {
            console.log('Jenkins build started, job name: ' + jenkins_info.job_name + ', build number: ' + buildNumber);
            buildStatus(jenkins_info.job_name, buildNumber, conn);
        }
    });

    //Get build status
    function buildStatus(jobName, buildNumber, conn) {
        jenkins.build.get(jobName, buildNumber, function(err, data) {
            if (err) {
                if (err.notFound === true) {
                    return buildStatus(jobName, buildNumber, conn);
                } else {
                    return console.log(err);
                }
            }
            if (data.building === true)
                return buildStatus(jobName, buildNumber, conn);

            returnBuildInfo(jobName, buildNumber, conn, data);
        });
    }

    function returnBuildInfo(jobName, buildNumber, conn, build_data) {
        jenkins.build.log(jobName, buildNumber, function(err, data) {
            if (err)
                return console.log(err);

            var build_report = {
                build_data: build_data,
                console_output: data
            };

            var key = new NodeRSA(process.env.JENKINS_PRIVATE_KEY);
            var build_report_encrypted = key.encryptPrivate(JSON.stringify(build_report), 'base64');

            conn.createChannel(function(err, ch) {
                if (err)
                    return console.log(err);

                console.log('Created RabbitMQ Channel 2');

                var ex = 'jenkins_info';

                ch.assertExchange(ex, 'fanout', {durable: true});
                ch.publish(ex, '', new Buffer(build_report_encrypted));
            });
        });
    }
}
