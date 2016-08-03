var amqp = require('amqplib/callback_api');
var bunyan = require('bunyan');
var fs = require('fs');

var connection = null;
var log = bunyan.createLogger({name: "jenkins-service"});

exports.connect = function(callback) {
    amqp.connect(process.env.RABBITMQ_URL, {
        ca: [fs.readFileSync('./app/modules/rabbitmq.cert')]
    }, function(err, conn) {
        if (err)
            return log.error(err);
        connection = conn;
        callback();
    });
};

exports.get = function() {
    return connection;
};
