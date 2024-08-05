const { GetObjectCommand, S3 } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const util = require('util');
const sharp = require('sharp');
const s3 = new S3();

const { models } = require('../lib/sequelize');
const objectImageType = {
    jnpg:"jnpg",
    png:"png",
    jpg:"jpg",
    jpeg:"jpeg",
}

const thumbnailGenerator = async (event, context) => {
    console.log("Reading options from event: \n", util.inspect(event, { depth: 5 }));
    const srcBucket = event.Records[0].s3.bucket.name;
    const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));

    const project = srcKey.match(/(\d+)-[^-]*$/);
    const typeMatch = srcKey.match(/\.([^.]*)$/);

    if (!typeMatch) {
        console.log("could not determine the image type.");
        return;
    }

    const imageType = typeMatch[1].toLowerCase();
    
    if (!objectImageType[imageType]) {
        console.log(`Unsupported image type: ${imageType}`);
        return;
    }

    let origimage = null;
    let str = null
    try {
        const input = {
            "Bucket": srcBucket,
            "Key": srcKey,
        };
        const command = new GetObjectCommand(input);
        origimage = await s3.send(command);
        str = await origimage.Body.transformToByteArray();

    } catch (error) {
        console.log("[error]");
        console.log(error);
        return;
    }

    const widths = [400];

    for (const w of widths) {
        await resizer(str, w, srcBucket, srcKey, parseInt(project[1]))
    }
};

const resizer = async (imgBody, newSize, dstBucket, fileKey, projectId) => {
    console.log("id: ", projectId);
    const nameFile = fileKey.split('/')[1]
    const dstKey = `resized/${newSize}-${nameFile}`;
    let buffer = null
    try {

        buffer = await sharp(imgBody)
            .resize(newSize, 400)
            .toBuffer();
        console.log('Imagen redimensionada exitosamente');
    } catch (error) {
        console.error(`Error redimensionando la imagen: ${error}`);
        return;
    }


    try {
        const destparams = {
            Bucket: dstBucket,
            Key: dstKey,
            Body: buffer,
            ContentType: "image"
        };

        const resp = await s3.putObject(destparams);
        const params = {
            Bucket: process.env.BUCKET,
            Key: dstKey
        }

        const command = new GetObjectCommand(params)
        const url = await getSignedUrl(s3, command)
        const extractedUrl = url.split('?')[0];
        console.log(extractedUrl);
        const newproject = await models.Project.findByPk(projectId)
        console.log('project: ', newproject.dataValues.name);
        
        const project = await models.Project.update({ img: extractedUrl }, { where: { id: projectId } })
        console.log('update: ',project);
    } catch (error) {
        console.log(error);
        return;
    }

    console.log('Successfully resized ' + dstBucket + '/' + fileKey +
        ' and uploaded to ' + dstBucket + '/' + dstKey);

}

module.exports = {
    thumbnailGenerator
};
