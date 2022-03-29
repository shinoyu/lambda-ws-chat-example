const { CONNECTION_TABLE_NAME, MESSAGE_TABLE_NAME } = process.env
import { DynamoDBClient as DynamoDB } from '@aws-sdk/client-dynamodb'

exports.handler = function (event, context, callback) {
  let roomId = ''
  if (event.queryStringParameters && event.queryStringParameters.roomId) {
    roomId = event.queryStringParameters.roomId
  }

  const putParams = {
    TableName: CONNECTION_TABLE_NAME,
    Item: {
      connectionId: { S: event.requestContext.connectionId },
      roomId: { S: roomId }
    }
  }

  const dynamoClient = new DynamoDB({ region: process.env.AWS_REGION });
  dynamoClient.putItem(putParams, (err) => {
    callback(null, {
      statusCode: err ? 500 : 200,
      body: err ? 'Failed to connect: ' + JSON.stringify(err) : 'Connected.'
    })
  })

  // TODO: テーブルに残っている未送信データがあったら、wsチャンネルを開いて送信し、
  // 接続者側に受信させる
}