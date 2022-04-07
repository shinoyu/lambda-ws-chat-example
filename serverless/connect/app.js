const { CONNECTION_TABLE_NAME, MESSAGE_TABLE_NAME } = process.env
const AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
  let roomId = ''
  if (event.queryStringParameters && event.queryStringParameters.roomId) {
    roomId = event.queryStringParameters.roomId
  } else {
    callback(null, {
      statusCode: 500,
      body: "need roomId Params"
    });
  }
  const connectionId = event.requestContext.connectionId
  const putParams = {
    TableName: CONNECTION_TABLE_NAME,
    Item: {
      connectionId: { S: connectionId },
      roomId: { S: roomId }
    }
  }

  const dynamoClient = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    region: process.env.AWS_REGION 
  });
  dynamoClient.putItem(putParams, (err) => {
    if (err) {
      callback(null, {
        statusCode: 500,
        body: 'Failed to connect: ' + JSON.stringify(err)
      });
    } else {
      callback(null, { statusCode: 200, body: 'connedted'});
    }
  })
}