var https = require('https');
var querystring = require('querystring');
var codedeploy_url = 'https://' + region + '.console.aws.amazon.com/codedeploy/home?region=' + region + '#/deployments/';
var region = 'XXXXXXXX';

exports.handler = function(event, context) {
 (event.Records || []).forEach(function (rec) {
  var message = JSON.parse(rec.Sns.Message);
  var post_message = `deploymentGroupName: ${message.deploymentGroupName}`
      + `\ndeploymentId: ${message.deploymentId}`
      + `\nstatus: ${message.status}`
      + `\n${codedeploy_url}${message.deploymentId}`;

  var postData = querystring.stringify({
    body: post_message
  });

  var options = {
    host: 'api.chatwork.com',
    port: 443,
    method: 'POST',
    path: '/v2/rooms/XXXXXXXX/messages',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length,
      'X-ChatWorkToken': 'XXXXXXXX'
    }
  };

  var req = https.request(options, function (res) {
    res.on('data', function (d) {
      process.stdout.write(d);
    });
    res.on('end', function () {
      context.done();
    });
  });

  req.on('error', function (err) {
    console.log(err);
  });

  req.write(postData);
  req.end();
 });
};
