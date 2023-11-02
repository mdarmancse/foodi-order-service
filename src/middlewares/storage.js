// @ts-nocheck
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client as S3SdkClient } from "@aws-sdk/client-s3";
import sanitize from "sanitize-filename";
import path from "path";
import { v4 } from "uuid";

const ServicePrefix = process.env.AWS_S3_SERVICE_FOLDER || "";
const MaxFileSize = 5 * 1024 * 1024;
const AllowedMimetypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];

export class FileTypeError extends Error {}

export const S3Bucket = process.env.AWS_S3_BUCKET || "";

export const S3Client = new S3SdkClient({
  region: process.env.AWS_S3_REGION || "",
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY || "",
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || "",
  },
});

const uploader = multer({
  limits: {
    fileSize: MaxFileSize,
  },
  storage: multerS3({
    s3: S3Client,
    bucket: S3Bucket,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const fileName = sanitize(file.originalname);
      cb(
        null,
        path.join(ServicePrefix, `${v4().replaceAll("-", "")}-${fileName}`),
      );
    },
  }),
  fileFilter: (req, file, callback) => {
    if (AllowedMimetypes.some((mt) => mt === file.mimetype)) {
      callback(null, true);
      return;
    }
    callback(new FileTypeError("File type not supported"));
  },
});

export const singleUpload = (fieldName) => uploader.single(fieldName);

export const multiUpload = (fieldName) => uploader.array(fieldName);
