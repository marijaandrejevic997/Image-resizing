var express = require('express');
var router = express.Router();
const AWS = require('aws-sdk');
const BUCKET_NAME = 'im-homework'
const s3 = new AWS.S3({
    accessKeyId: 'AKIA3UJVVYF5U67Q7AHL',
    secretAccessKey: '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',
    region: 'us-east-1'
})

async function upload (imageName, base64Image, type){
    const params = {
        Bucket: `${BUCKET_NAME}`,
        Key: imageName,
        Body: new Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64'),
        ContentType: type
    };
    let data;

    try {
        data = await promiseUpload(params);
    } catch(err) {
        console.error(err);
        return "";
    }
    return data.Location;
}


function promiseUpload(params) {
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

/* GET home page. */
router.post('/', async function(req, res, next) {
    console.log(req.body.image);
    console.log(req.body.name);
    console.log(req.body.type);
    try{
        response = await upload(req.body.name, req.body.image);
    } catch (err) {
        console.error(`Error uploading image: ${err.message}`);
        res.send(err);
    }
    res.send({link: response});
});

module.exports = router;