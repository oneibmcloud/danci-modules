//Required dependencies
var async = require('async');
var bunyan = require('bunyan');
var express = require('express');

var amqp = require('./app/modules/amqp.js');
var jenkins = require('./app/jenkins.js');

var log = bunyan.createLogger({name: 'jenkins-service'});

//Create express server & socket.io
var app = express();

amqp.connect(function(err) {
    if (err)
        return log.error(err);
    log.info('Connected to CloudAMQP', amqp);
    createChannel();
});

function createChannel() {
    amqp.get().createChannel(function(err, channel) {
        if (err)
            return log.error(err);

        log.info('Create channel', channel);

        var q = 'build_queue';
        channel.assertQueue(q, {durable: true});
        channel.consume(q, function(jenkins_info) {
            jenkins(JSON.parse(jenkins_info.content.toString()));
            channel.ack(jenkins_info);
        }, {noAck: false});
    });
}
//Start Express Server
app.listen(process.env.PORT, '0.0.0.0', function() {
    log.info('Express Server Started');
});
