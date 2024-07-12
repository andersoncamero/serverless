const { GetObjectCommand, S3 } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const util = require('util');
const s3 = new S3(
    { signatureVersion: 'v4', }
);

const getImage = async (event, context) => {
    const params = {
        Bucket: process.env.BUCKET,
        Key: 'resized/400-image.png'
    }

    const command = new GetObjectCommand(params)
    const url = await getSignedUrl(s3, command)

    return {
        "statusCode": 200,
        "body": JSON.stringify({ url })
    }
};


module.exports = {
    getImage
};
