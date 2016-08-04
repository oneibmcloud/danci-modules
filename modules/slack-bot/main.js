var Slack = require('slack-node');

var webhookUri = process.env.SLACK_WEBHOOK;

var slack = new Slack();
slack.setWebhook(webhookUri);

slack.webhook({
  channel: process.env.CHANNEL_NAME,
  username: process.env.USER_NAME,
  text: "Here is a link to the build history: <"+ process.env.DANCI_BUILD_URL+">"
}, function(err, response) {
  if (err) {
          return console.log('slack post failed');
      }
});
