var Slack = require('slack-node');

webhookUri = "https://hooks.slack.com/services/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";

slack = new Slack();
slack.setWebhook(webhookUri);

slack.webhook({
  channel: process.env.CHANNEL_NAME,
  username: process.env.USER_NAME,
  text: "Here is a link to the build history: <"+ process.env.DANCI_BUILD_URL+">"
}, function(err, response) {
  if (err) {
          console.log('DANCI_ERROR: running git clone');
          console.log('DANCI_STEP_SUMMARY_Error running git clone');
          return console.log('DANCI_STEP_STATUS_FAILURE');
      }
});
