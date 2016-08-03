//Required dependencies
var express = require('express');

var amqp = require('./app/modules/amqp.js');
var jenkins = require('./app/jenkins.js');

var app = express();

amqp.connect(function(err) {
    if (err) {
        console.log('DANCI_STEP_SUMMARY_' + err);
        console.log('DANCI_STEP_STATUS_FAILURE');
        console.log(err);
        return console.log('DANCI_ERROR: ' + err);
    }
    console.log('Connected to CloudAMQP');
    jenkins(app);
});

//Start Express Server
app.listen(process.env.PORT || 8080, '0.0.0.0', function() {
    console.log('Express Server Started');
});
