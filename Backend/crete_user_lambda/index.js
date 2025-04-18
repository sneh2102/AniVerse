const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {     
  const {email, name} = event;
  const userId = Math.random().toString(36).substring(2) + Date.now().toString(36)
  
  const params = {
    TableName: 'b00968316-User',
    Item: {
      userId: userId,
      name: name,
      email: email,
      role: 'user',
    },
  };

  try {
    await dynamodb.put(params).promise();

    return {
      statusCode: 200,
      body: {
        result: {
          email: email,
          name: name, 
          userId: userId,
          role: 'user',
        },
        message: 'Item stored successfully',
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
      body: {
        message: 'Error storing item',
        error: err.message,
      },
    };
  }
};