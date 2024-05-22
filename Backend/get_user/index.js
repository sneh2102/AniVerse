const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {    
  const {email} = event;
  console.log('event:', event);
  
  const params = {
    TableName: 'b00968316-User',
    Key: {
        "email": email
    },
  };

  try {
    const result = await dynamodb.get(params).promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body:{
        result: result
      },
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
        message: 'Error storing item',
        error: err.message,
      }),
    };
  }
};