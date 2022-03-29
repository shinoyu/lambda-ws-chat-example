const { CONNECTION_TABLE_NAME } = process.env
import { DynamoDBClient as DynamoDB } from '@aws-sdk/client-dynamodb'

exports.handler = function (event, context, callback) {
    
  const deleteParams = {
    TableName: CONNECTION_TABLE_NAME,
    Key: {
      connectionId: { S: event.requestContext.connectionId }
    }
  }
  const dynamoClient = new DynamoDB({ region: process.env.AWS_REGION });
  dynamoClient.deleteItem(deleteParams, function (err) {
    callback(null, {
      statusCode: err ? 500 : 200,
      body: err ? 'Failed to disconnect: ' + JSON.stringify(err) : 'Disconnected.'
    })
  })
}