//Required dependencies
var amqp = require('amqplib/callback_api');

/*
var express = require('express');
var app = express();
//Start Express Server
app.listen(process.env.PORT || 8080, '0.0.0.0', function() {
    console.log('Express Server Started');
});
*/

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
});

function jenkins_api() {
    var jenkins_info = {
        'url': process.env.JENKINS_URL,
        'job_name': process.env.JENKINS_JOB_NAME,
        'job_token': process.env.JENKINS_JOB_TOKEN
    };
    amqp.get().createChannel(function(err, channel) {
        if (err) {
            console.log(err);
            console.log('DANCI_STEP_SUMMARY_' + err);
            console.log('DANCI_STEP_STATUS_FAILURE');
            return console.log('DANCI_ERROR_' + err);
        }
        var q = 'build_queue';
        channel.assertQueue(q, {durable: true});
        channel.sendToQueue(q, new Buffer(JSON.stringify(jenkins_info)), {persistent: true});
        console.log('Sent to queue');
        //temporary:
        process.exit();
    });
}
