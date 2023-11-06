const AWS = require('aws-sdk');
const cloudwatchlogs = new AWS.CloudWatchLogs();

// Log to CloudWatch Logs
function logToCloudWatch(message) {
  const params = {
    logGroupName: 'webapp-logs',
    logStreamName: 'your-log-stream-name',
    logEvents: [
      {
        message: message,
        timestamp: new Date().getTime(),
      },
    ],
  };

  cloudwatchlogs.putLogEvents(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log('Logged to CloudWatch:', data);
  });
}

// Example usage
logToCloudWatch('This is a log message');
