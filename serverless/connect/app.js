const { CONNECTION_TABLE_NAME, MESSAGE_TABLE_NAME } = process.env
const AWS = require('aws-sdk');

exports.handler = function (event, context, callback) {
  let roomId = ''
  if (event.queryStringParameters && event.queryStringParameters.roomId) {
    roomId = event.queryStringParameters.roomId
  }
  // TODO: roomId undefined, brake connection.

  const putParams = {
    TableName: CONNECTION_TABLE_NAME,
    Item: {
      connectionId: { S: event.requestContext.connectionId },
      roomId: { S: roomId }
    }
  }

  const dynamoClient = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    region: process.env.AWS_REGION 
  });
  dynamoClient.putItem(putParams, (err) => {
    callback(null, {
      statusCode: err ? 500 : 200,
      body: err ? 'Failed to connect: ' + JSON.stringify(err) : 'Connected.'
    })
  })

  // TODO: テーブルに残っている未送信データがあったら、wsチャンネルを開いて送信し、
  // 接続者側に受信させる
}