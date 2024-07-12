const {
    getSignedUrl,
} = require("@aws-sdk/s3-request-presigner");

const {
    PutObjectCommand,
    S3,
} = require("@aws-sdk/client-s3");

const s3 = new S3({
    signatureVersion: 'v4',
})

const signedS3URL = async (event, context) => {
    const filename = event.queryStringParameters.filename
    const signedUrl = await getSignedUrl(s3, new PutObjectCommand({
        Key: `upload/${filename}`,
        Bucket: process.env.BUCKET,
    }), {
        expiresIn: 300,
    });

    return {
        "statusCode": 200,
        "body": JSON.stringify({ signedUrl })
    }
}

module.exports = {
    signedS3URL
}