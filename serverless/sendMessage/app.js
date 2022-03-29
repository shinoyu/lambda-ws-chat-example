const { CONNECTION_TABLE_NAME, MESSAGE_TABLE_NAME } = process.env
import { DynamoDBClient as DynamoDB } from '@aws-sdk/client-dynamodb'
import { ApiGatewayManagementApiClient } from "@aws-sdk/client-apigatewaymanagementapi";

exports.handler = async (event, context) => {
  const roomId = JSON.parse(event.body).roomId
  const senderConnectionId = event.requestContext.connectionId
  const dynamoClient = new DynamoDB({ region: process.env.AWS_REGION });
  const apigwManagementClient = new ApiGatewayManagementApiClient({
    region: process.env.AWS_REGION,
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  })

  const queryParams = {
    TableName: CONNECTION_TABLE_NAME,
    KeyConditionExpression: "#ROOMID = :ROOMID",
    ExpressionAttributeNames: { "#ROOMID": "roomId" },
    ExpressionAttributeValues: { ":ROOMID": roomId },
  }
  const connectionData = await dynamoClient.query(queryParams).promise()


  const postData = JSON.parse(event.body).data
  // TODO: ここで未読み込みのデータを引っ張ってきて、それも一緒に送信すること


  const postCalls = connectionData.Items.map(async ({ connectionId }) => {
    if (senderConnectionId !== connectionId) {
    await apigwManagementClient.postToConnection({ ConnectionId: connectionId, Data: postData }).promise()
    }
  })

  try {
    await Promise.all(postCalls)
  } catch (e) {
    return { statusCode: 500, body: e.stack }
  }

  return { statusCode: 200, body: 'Data sent.' }
}
