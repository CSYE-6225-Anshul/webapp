const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch();

const publishCustomMetric = (apiEndpoint) => {
  const params = {
    MetricData: [
      {
        MetricName: 'ApiUsage',
        Dimensions: [
          {
            Name: 'ApiEndpoint',
            Value: apiEndpoint,
          },
        ],
        Unit: 'Count',
        Value: 1,
      },
    ],
    Namespace: 'webapp-metrics',
  };

  cloudwatch.putMetricData(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log('Published custom metric:', data);
  });
}

module.exports = publishCustomMetric;
