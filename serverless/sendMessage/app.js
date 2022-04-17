const { CONNECTION_TABLE_NAME, MESSAGE_TABLE_NAME } = process.env
const AWS = require('aws-sdk');

exports.handler = async (event, context, callback) => {
  let roomId = ''
  const message = JSON.parse(event.body) 
  console.log(`receive message: ${JSON.stringify(message)}`)
  if(message.roomId) { 
    roomId = message.roomId;
  } else {
    callback(null, {
      statusCode: 500,
      body: "need roomId Params"
    });
  }

  // const senderConnectionId = event.requestContext.connectionId
  const dynamoClient = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    region: process.env.AWS_REGION 
  });
  const apigwManagementClient =  new AWS.ApiGatewayManagementApi({
    region: process.env.AWS_REGION,
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  })

  // TODO: add message db

  const queryParams = {
    TableName: CONNECTION_TABLE_NAME,
    KeyConditionExpression: "roomId = :roomId",
    ExpressionAttributeValues: { ":roomId": { "S": roomId }},
    IndexName: 'roomId_index'
  }
  const connectionData = await dynamoClient.query(queryParams).promise()
  const senderConnectionId = event.requestContext.connectionId
  const postData = JSON.stringify({
    senderId: message.senderId,
    body: message.body,
    roomId: roomId,
    attachments: []
  })
  // TODO: ここで未読み込みのデータを引っ張ってきて、それも一緒に送信すること
  console.log(`data: ${postData}`)

  const postCalls = connectionData.Items.map(async (record) => {
    const connectionId = record.connectionId.S
    await apigwManagementClient.postToConnection({ ConnectionId: connectionId, Data: postData }).promise()
  })

  try {
    await Promise.all(postCalls)
  } catch (err) {
    console.error(err)
    callback(null, {
      statusCode: 500,
      body: 'Failed to connect: ' + JSON.stringify(err)
    });
  }
  callback(null, {
    statusCode: 200,
    body: 'Data sent.'
  });
}
