//Required dependencies
var amqp = require('amqplib/callback_api');
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'jenkins-service'});

amqp.connect(fs.readFileSync('./rabbitmq_url'), {
    ca: [fs.readFileSync('./rabbitmq_cert')]
}, function(err, conn) {
    if (err)
        return log.error(err);
    amqp.get().createChannel(function(err, channel) {
        if (err)
            return log.error(err);

        log.info('Create channel', channel);

        var q = 'build_queue';
        channel.assertQueue(q, {durable: true});
        channel.consume(q, function(jenkins_info) {
            console.log('RECEIVED!!');
            //jenkins_service(JSON.parse(jenkins_info.content.toString()));
            channel.ack(jenkins_info);
        }, {noAck: false});
    });
});

function jenkins_service(jenkins_info) {
    var jenkins = require('jenkins')(jenkins_info.url);

    //Trigger new build
    jenkins.job.build({
        'name': jenkins_info.job_name,
        'token': jenkins_info.job_token
    }, function(err) {
        if (err) {
            return err;
        }
        console.log('build started');
        //buildStatus();
    });

    //Get build status
    function buildStatus(buildName, buildId) {
        jenkins.build.get(buildName, buildId, function(err, data) {
            if (err)
                return err;
            if (data.inQueue === false) {
                buildLog(buildName, buildId);
            } else {
                buildStatus(buildName, buildId);
            }
        });
    }

    //Get build log
    function buildLog(buildName, buildId) {
        jenkins.build.get(buildName, buildId, function(err, data) {
            if (err)
                return err;
            console.log(data);
        });
    }
}

/*
var express = require('express');
var app = express();
//Start Express Server
app.listen(process.env.PORT || 8080, '0.0.0.0', function() {
    log.info('Express Server Started');
});
*/
