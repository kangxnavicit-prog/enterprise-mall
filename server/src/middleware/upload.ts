// Enterprise Mall - File Upload Middleware
// Configures multer for product image uploads with size and file type validation

import multer from 'multer';
import path from 'path';
import { UPLOAD_DIR, MAX_FILE_SIZE } from '../config';
import { createBadRequestError } from '../utils/errors';

/** Allowed MIME types for product image uploads */
const ALLOWED_MIME_TYPES: string[] = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

/** Storage configuration for multer */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix: string = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext: string = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

/** File filter that only accepts allowed image MIME types */
const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, GIF, and WebP images are allowed'));
  }
};

/** Configured multer instance for single product image upload */
export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

/** Configured multer instance for multiple product image uploads (up to 5) */
export const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5,
  },
});
