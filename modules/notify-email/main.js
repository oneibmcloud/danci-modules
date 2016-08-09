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
     return console.log('Failed Sending Email');
 }
});
