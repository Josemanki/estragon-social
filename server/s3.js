const fs = require('fs');
const aws = require('aws-sdk');

let secrets;
if (process.env.NODE_ENV == 'production') {
  secrets = process.env;
} else {
  secrets = require('../secrets');
}

const Bucket = 'spicedling';

const s3 = new aws.S3({
  accessKeyId: secrets.AWS_KEY,
  secretAccessKey: secrets.AWS_SECRET,
});

function s3upload(req, res, next) {
  console.log('s3', req.file.path);
  if (!req.file) {
    console.log('s3 - missing file!');
    res.status(400).send('s3 - no file available');
    return;
  }

  const { filename, mimetype, size, path } = req.file;

  s3.putObject({
    Bucket,
    ACL: 'public-read',
    Key: filename,
    Body: fs.createReadStream(req.file.path),
    ContentType: mimetype,
    ContentLength: size,
  })
    .promise()
    .then(() => {
      console.log('s3 - upload-successful');
      next();
    })
    .catch((error) => {
      console.log('s3 - error uploading', error);
      res.status(400).send('s3 - Oops! Error uploading');
    });
}

module.exports = {
  Bucket,
  s3upload,
};
