const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch({ region: process.env.REGION });

const publishCustomMetric = (apiEndpoint, method) => {
  const params = {
    MetricData: [
      {
        MetricName: 'ApiUsage',
        Dimensions: [
          {
            Name: 'Endpoint',
            Value: apiEndpoint,
          },
          {
            Name: 'Method',
            Value: method,
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
