var user = 'SENDGRID_USER';
var key = 'SENDGRID_PASS';
var SendGrid = require('sendgrid-nodejs').SendGrid;
var sendgrid = new SendGrid(user, key);
sendgrid.send({
    to: 'TO_EMAIL_ADDRESS',
    from: 'FROM_EMAIL_ADDRESS',
    subject: 'EMAIL_SUBJECT',
    text: 'EMAIL_BODY'
}, function(err) {
  if (err) {
     console.log('DANCI_ERROR: running git clone');
     console.log('DANCI_STEP_SUMMARY_Error running git clone');
     return console.log('DANCI_STEP_STATUS_FAILURE');
 }
});
