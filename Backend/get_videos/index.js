const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {    
  
  const params = {
    TableName: 'b00968316-Video'
  };

  try {
    const result = await dynamodb.scan(params).promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: {
        result: result
      }
    };
  } catch (err) {
    console.error('Error storing item:', err);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: 'Error getting item',
        error: err.message,
      }),
    };
  }
};