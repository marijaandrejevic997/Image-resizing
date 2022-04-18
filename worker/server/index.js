// server/index.js

var AWS = require('aws-sdk');
const { Consumer } = require('sqs-consumer');

// Set the region 
AWS.config.update({ region: 'REGION' });


// Create the SQS service object
const sqs = new AWS.SQS({
    apiVersion: '2012-11-05',
    accessKeyId: "",
    secretAccessKey: "",
    region: ""
})

function resize(message) {
    console.log(message);
    /*
        The idea here is to parse Body in the message, to get an address, to download an image.
        The next step is to get a dimension from the image_size, and then using some module to 
        resize picture, and upload this picture to the S3 bucket again, exactly how this is done 
        with server (backend project)
    */
}

const queueUrl = ""
var params = {
    AttributeNames: [
        "SentTimestamp"
    ],
    MaxNumberOfMessages: 1,
    MessageAttributeNames: [
        "All"
    ],
    QueueUrl: queueUrl,
    WaitTimeSeconds: 20
};

const app = Consumer.create({
    queueUrl: queueUrl,
    handleMessage: async (message) => {
        resize(message)
    },
    sqs: sqs
})

app.on('error', (err) => {
    console.error(err.message);
});

app.on('processing_error', (err) => {
    console.error(err.message);
});

console.log('Message receiving');
app.start();



