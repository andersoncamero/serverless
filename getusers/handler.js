const {
    DynamoDBDocument,
} = require('@aws-sdk/lib-dynamodb');

const {
    DynamoDB,
} = require('@aws-sdk/client-dynamodb');

let dynamoDBClientParams = {}

if (process.env.IS_OFFLINE) {
    dynamoDBClientParams = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
        accessKeyId: 'DEFAULT_ACCESS_KEY',  // needed if you don't have aws credentials at all in env
        secretAccessKey: 'DEFAULT_SECRET',
    }
}

const dynamodb = DynamoDBDocument.from(new DynamoDB(dynamoDBClientParams))


const getUsers = async (event, context) => {
    let userId = event.pathParameters.id
    console.log(userId,"id");
    const params = {
        ExpressionAttributeValues: { ':pk': userId },
        KeyConditionExpression: 'pk = :pk',
        TableName: 'usersTable'

    }
    return dynamodb.query(params).then(res => {
        console.log(res);
        return {
            "statusCode": 200,
            "body": JSON.stringify({ 'user': res })
        }
    })
}

module.exports = {
    getUsers
}