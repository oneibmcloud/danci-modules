//Required dependencies
var amqp = require('amqplib/callback_api');
var NodeRSA = require('node-rsa');

amqp.connect(process.env.RABBITMQ_URL, {
    ca: [process.env.RABBITMQ_CERT]
}, function(err, conn) {
    if (err) {
        console.log('DANCI_STEP_SUMMARY_' + err);
        console.log('DANCI_STEP_STATUS_FAILURE');
        console.log(err);
        return console.log('DANCI_ERROR_' + err);
    }
    console.log('Connected to RabbitMQ Server');

    var jenkins_info = {
        'url': process.env.JENKINS_URL,
        'job_name': process.env.JENKINS_JOB_NAME,
        'job_token': process.env.JENKINS_JOB_TOKEN
    };

    var pubKey = new NodeRSA(process.env.JENKINS_PUB_KEY);
    var jenkins_info_encrypted = pubKey.encrypt(JSON.stringify(jenkins_info), 'base64');

    conn.createChannel(function(err, ch) {
        if (err) {
            console.log(err);
            console.log('DANCI_STEP_SUMMARY_' + err);
            console.log('DANCI_STEP_STATUS_FAILURE');
            return console.log('DANCI_ERROR_' + err);
        }

        console.log('Created RabbitMQ Channel');

        var ex = 'jenkins_queue';

        ch.assertExchange(ex, 'fanout', {durable: true});
        ch.publish(ex, '', new Buffer(jenkins_info_encrypted));

        console.log('Sent build trigger to jenkins-service');
    });

    conn.createChannel(function(err, ch) {
        if (err) {
            console.log(err);
            console.log('DANCI_STEP_SUMMARY_' + err);
            console.log('DANCI_STEP_STATUS_FAILURE');
            return console.log('DANCI_ERROR_' + err);
        }

        console.log('Created RabbitMQ Channel 2');

        var q = 'jenkins_info';

        ch.assertQueue(q, {durable: true});
        ch.consume(q, function(jenkins_info) {
            var build_info = JSON.parse(jenkins_info.content.toString());

            console.log(build_info.build_data);
            console.log('Jenkins Console Output:');
            console.log(build_info.console_output);

            if (build_info.build_data.result == 'SUCCESS') {
                console.log('DANCI_STEP_SUMMARY_Jenkins ' + build_info.build_data.fullDisplayName + ' succeeded');
                console.log('DANCI_STEP_STATUS_SUCCESS');
            } else {
                console.log('DANCI_STEP_SUMMARY_Jenkins ' + build_info.build_data.fullDisplayName + ' failed');
                console.log('DANCI_STEP_STATUS_FAILURE');
            }

            process.exit(0);

        }, {noAck: true});
    });
});
