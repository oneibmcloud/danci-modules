//Required dependencies
var async = require('async');
var express = require('express');

var amqp = require('./app/modules/amqp.js');
var jenkins = require('./app/jenkins.js');

//Create express server & socket.io
var app = express();

jenkins(app);

amqp.connect(function(err) {
    if (err) return console.log(err);
    console.log('Connected to CloudAMQP');
});

//Start Express Server
app.listen(process.env.PORT, '0.0.0.0', function() {
    log.info('Express Server Started');
});
