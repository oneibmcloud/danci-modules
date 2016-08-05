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
            jenkins_service(JSON.parse(jenkins_info.content.toString()));
            ch.ack(jenkins_info);
        }, {noAck: false});
    });
});

//IMPORTANT: DOES NOT SUPPORT CRUMBS YET..., SEE NODE API OPEN ISSUES

function jenkins_service(jenkins_info) {
    var jenkins = require('jenkins')(jenkins_info.url);

    //Trigger new build
    jenkins.job.build({
        'name': jenkins_info.job_name,
        'token': jenkins_info.job_token
    }, function(err, buildNumber) {
        if (err) {
            return console.log(err);
        }
        console.log('Jenkins build started...');
        buildStatus(jenkins_info.job_name, buildNumber);
    });

    //Get build status
    function buildStatus(jobName, buildNumber) {
        jenkins.build.get(jobName, buildNumber, function(err, data) {
            if (err)
                return console.log(err);
            if (data.building === true) {
                buildStatus(jobName, buildNumber);
            } else {
                buildLog(jobName, buildNumber);
            }
        });
    }

    //Get build log
    function buildLog(jobName, buildNumber) {
        jenkins.build.get(jobName, buildNumber, function(err, data) {
            if (err)
                return console.log(err);
            console.log(data);
        });
    }
}

/*
var express = require('express');
var app = express();
//Start Express Server
app.listen(process.env.PORT || 8080, '0.0.0.0', function() {
    console.log('Express Server Started');
});
*/
