// Enterprise Mall - XLSX File Upload Middleware
// Configures multer for Excel (.xlsx) file uploads with size and file type validation

import multer from 'multer';
import path from 'path';
import { MAX_FILE_SIZE } from '../config';
import { createBadRequestError } from '../utils/errors';

/** Allowed MIME types for Excel file uploads */
const ALLOWED_XLSX_MIME_TYPES: string[] = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];

/** Allowed file extensions for Excel uploads */
const ALLOWED_EXTENSIONS: string[] = ['.xlsx', '.xls'];

/** Storage configuration for multer — store in memory for xlsx parsing */
const storage = multer.memoryStorage();

/** File filter that only accepts Excel MIME types */
const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
  const ext: string = path.extname(file.originalname).toLowerCase();

  // Check both MIME type and file extension for robustness
  if (ALLOWED_XLSX_MIME_TYPES.includes(file.mimetype) || ALLOWED_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .xlsx and .xls Excel files are allowed'));
  }
};

/** Configured multer instance for single xlsx file upload (stored in memory) */
export const uploadXlsx = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});
