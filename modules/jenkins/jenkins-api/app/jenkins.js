module.exports = function() {

    var jenkins_info = {
        'url': process.env.JENKINS_URL,
        'job_name': process.env.JENKINS_JOB_NAME,
        'job_token': process.env.JENKINS_JOB_TOKEN
    };
    sendToQueue(jenkins_info);

    function sendToQueue(jenkins_info) {
        amqp.get().createChannel(function(err, channel) {
            if (err)
                return console.log(err);
            var q = 'build_queue';
            channel.assertQueue(q, {durable: true});
            channel.sendToQueue(q, new Buffer(JSON.stringify(jenkins_info)), {persistent: true});
        });
    }

};
