var amqp = require('amqplib/callback_api');
var bunyan = require('bunyan');

var connection = null;
var log = bunyan.createLogger({name: "jenkins-api"});

exports.connect = function(callback) {
    amqp.connect(process.env.RABBITMQ_URL, {
        ca: [process.env.RABBITMQ_CERT]
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
