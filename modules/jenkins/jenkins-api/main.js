//Required dependencies
var amqp = require('amqplib/callback_api');

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

    conn.createChannel(function(err, ch) {
        if (err) {
            console.log(err);
            console.log('DANCI_STEP_SUMMARY_' + err);
            console.log('DANCI_STEP_STATUS_FAILURE');
            return console.log('DANCI_ERROR_' + err);
        }

        console.log('Created RabbitMQ Channel');

        var q = 'jenkins_queue';

        ch.assertQueue(q, {durable: true});
        ch.sendToQueue(q, new Buffer(JSON.stringify(jenkins_info)));
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
            console.log(build_info);

            if (build_info.result == 'SUCCESS') {
                console.log('DANCI_STEP_SUMMARY_Jenkins ' + build_info.fullDisplayName + ' was successful');
                console.log('DANCI_STEP_STATUS_SUCCESS');
            }

            process.exit(0);

        }, {noAck: true});
    });
});
