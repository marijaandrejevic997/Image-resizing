var express = require('express');
var router = express.Router();
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'})
const BUCKET_NAME = 'im-homework'
const s3 = new AWS.S3({
    accessKeyId: 'AKIA3UJVVYF5U67Q7AHL',
    secretAccessKey: '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',
    region: 'us-east-1'
})

const sqs = new AWS.SQS({
    apiVersion: '2012-11-05',
    accessKeyId: 'AKIA3UJVVYF5U67Q7AHL',
    secretAccessKey: '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',
    region: 'us-east-1'
})

async function upload (imageName, base64Image, type, size){
    let data;
    try{

        //uploading image to S3 bucket
        const params = {
            Bucket: `${BUCKET_NAME}`,
            Key: imageName,
            Body: new Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64'),
            ContentType: type
        };
    
        console.log(params);
        data = await promiseUpload(params);

        //adding task to SQS
        const paramsSQS = {
            DelaySeconds: 10,
            MessageAttributes: {
                "Title": {
                    DataType: "String",
                    StringValue: imageName
                }
            },
            MessageBody: JSON.stringify({
                "image_path": data.Location,
                "image_size": JSON.stringify(size)
            }),
            QueueUrl: "https://sqs.us-east-1.amazonaws.com/799513362811/im-homework"
        }

        let queueRes = await sqs.sendMessage(paramsSQS).promise();
        console.log(queueRes)
        const response = {
            statusCode: 200,
            body: queueRes
        }
    } catch(err) {
        console.error(err);
        return "";
    }
    return data.Location;
}


async function promiseUpload(params) {
    return new Promise(function (resolve, reject) {
        s3.upload(params, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

router.post('/', async function(req, res, next) {
    console.log("Uploading " + req.body.arrayImg.length + " images....")
    var array = req.body.arrayImg;
    var response;
    for (const image of array) {
        try{
            response = await upload(image.name, image.image, image.type, image.size);
        } catch (err) {
            console.error(`Error uploading image: ${err.message}`);
            res.send(err);
        }
    }
    
    res.send({link: response});
});

module.exports = router;