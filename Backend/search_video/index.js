const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const fieldValue = event.fieldValue;

  const params = {
    TableName: 'b00968316-Video',
    FilterExpression: 'begins_with(title, :value)',
    ExpressionAttributeValues: {
      ':value': fieldValue
    }
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    return data.Items;
  } catch (error) {
    console.error('Error retrieving data from DynamoDB:', error);
    throw error;
  }
};