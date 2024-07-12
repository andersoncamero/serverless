const {
    DynamoDBDocument,
} = require('@aws-sdk/lib-dynamodb');

const {
    DynamoDB,
} = require('@aws-sdk/client-dynamodb');

const {randomUUID} = require('crypto')

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

const createUsers = async (event, context) => {
    const id = randomUUID();
    let userBody = JSON.parse(event.body)

    userBody.pk = id;

    const params = {
        TableName: 'usersTable',
        Item: userBody
    }
    console.log(params.Item);

    return dynamodb.put(params).then(res => {
        console.log(res);
        return {
            "statusCode": 200,
            "body": JSON.stringify({ 'user': params.Item })
        }
    })
}

module.exports = {
    createUsers
}