const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {    
  const {title,vKey,tKey} = event;
  console.log('title:', title);
  console.log('vKey:', vKey);
  console.log('tKey:', tKey);
  
  const params = {
    TableName: 'b00968316-Video',
    Item: {
      vId: Math.random().toString(36).substring(2) + Date.now().toString(36),
      title: title,
      vKey: vKey,
      tKey: tKey,
    },
  };

  try {
    const result = await dynamodb.put(params).promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: {
        message: 'Item stored',
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
        message: 'Error storing item',
        error: err.message,
      }),
    };
  }
};