//Required dependencies
var amqp = require('amqplib/callback_api');

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

        var q = 'jenkins_queue';

        ch.assertQueue(q, {durable: true});
        ch.consume(q, function(jenkins_info) {
            jenkins_service(JSON.parse(jenkins_info.content.toString()), conn);
            ch.ack(jenkins_info);
        }, {noAck: false});
    });
});

//IMPORTANT: DOES NOT SUPPORT CRUMBS YET..., SEE NODE API OPEN ISSUES

function jenkins_service(jenkins_info, conn) {
    var jenkins = require('jenkins')(jenkins_info.url);

    //Trigger new build
    jenkins.job.build({
        'name': jenkins_info.job_name,
        'token': jenkins_info.job_token
    }, function(err, buildNumber) {
        if (err)
            return console.log(err);

        console.log('Jenkins build started, job name: ' + jenkins_info.job_name + ', build number: ' + (buildNumber + 1));
        buildStatus(jenkins_info.job_name, buildNumber + 1, conn);
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

            if (data.building === true) {
                buildStatus(jobName, buildNumber, conn);
            } else {
                conn.createChannel(function(err, ch) {
                    if (err)
                        return console.log(err);

                    console.log('Created RabbitMQ Channel 2');

                    var q = 'jenkins_info';

                    ch.assertQueue(q, {durable: true});
                    ch.sendToQueue(q, new Buffer(JSON.stringify(data)));
                });
            }
        });
    }
}
