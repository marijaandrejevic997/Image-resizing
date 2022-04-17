var express = require('express');
var router = express.Router();
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();
AWS.config.update({region: 'us-east-1'})
const BUCKET_NAME = 'im-homework'
const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
})

const sqs = new AWS.SQS({
    apiVersion: '2012-11-05',
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
})

async function upload (imageName, base64Image, type, size){
    let data;
    try{
        //uploading image to S3 bucket
        const params = {
            Bucket: `${BUCKET_NAME}`,
            Key: imageName,
            Body: new Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64'),
            ContentType: type,
            Tagging: "public=true"
        };
    
        data = await promiseUpload(params);
        console.log(data);
        
        
    } catch(err) {
        console.error(err);
        return "";
    }
    console.log(data);
    return data;
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
    var urls = [];
    var sizes = [];
    var names = [];
    for (const image of array) {
        try{
            sizes.push(image.size)
            names.push(image.name)
            response = await upload(image.name, image.image, image.type, image.size);
            //add location in the URL's array
            let url = {
                name: response.key,
                address: response.Location
            }
            urls.push(url);
        } catch (err) {
            console.error(`Error uploading image: ${err.message}`);
            res.send(err);
        }
    }
    //adding task to SQS
    const paramsSQS = {
        DelaySeconds: 10,
        MessageAttributes: {
            "Title": {
                DataType: "String",
                StringValue: "Resize task"
            }
        },
        MessageBody: JSON.stringify({
            "image_path": JSON.stringify(urls),
            "image_size": JSON.stringify(sizes),
            "image_name": JSON.stringify(names)
        }),
        QueueUrl: process.env.QUEUE_URL
    }


    let queueRes = await sqs.sendMessage(paramsSQS).promise();
    console.log(queueRes)
    res.send({link: urls});
});

module.exports = router;