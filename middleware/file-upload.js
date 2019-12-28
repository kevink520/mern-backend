const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid/v1');
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const s3UsersOptions = {
  s3,
  bucket: process.env.AWS_USERS_BUCKET_NAME,
  key: (req, file, cb) => {
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, `${uuid()}.${ext}`);
  },
};

const s3PlacesOptions = {
  s3,
  bucket: process.env.AWS_PLACES_BUCKET_NAME,
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req, file, cb) => {
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, `${uuid()}.${ext}`);
  },
};

const fileFilter = (req, file, cb) => {
  const isValid = !!MIME_TYPE_MAP[file.mimetype];
  const error = isValid ? null : new Error('Invalid mime type');
  cb(error, isValid);
};

const userPhotoUpload = multer({
  limits: 500000,
  storage: multerS3(s3UsersOptions),
  fileFilter,
});

const placePhotoUpload = multer({
  limits: 500000,
  storage: multerS3(s3PlacesOptions),
  fileFilter,
});

const placePhotoDelete = imgUrl => {
  s3.deleteObject({
    Bucket: process.env.AWS_PLACES_BUCKET_NAME,
    Key: imgUrl.split('/').pop(),
  }, (err, data) => console.log(err));
};

exports.userPhotoUpload = userPhotoUpload;
exports.placePhotoUpload = placePhotoUpload;
exports.placePhotoDelete = placePhotoDelete;
