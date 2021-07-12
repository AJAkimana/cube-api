import { existsSync, mkdirSync } from 'fs';
import multer from 'multer';
import path from 'path';
import { randomBytes } from 'crypto';
import {
  ACCEPTED_FILE_SIZE,
  deleteDirFilesUsingPattern,
  isFileAllowed,
} from './helpers';
import { serverResponse } from './response';

export const uploadFiles = (req, res) => {
  let fileStorage = null;
  const { fileType } = req.params;
  const { prevFile } = req.query;
  const randStr = randomBytes(10).toString('hex');
  if (fileType === 'image') {
    fileStorage = process.env.IMAGES_ZONE;
  } else return serverResponse(res, 400, 'Unknown file upload');
  if (!existsSync(fileStorage)) {
    mkdirSync(fileStorage, { recursive: true });
  }
  /**
   * Delete the previous file if exist
   */
  if (prevFile) {
    const prevFileName = prevFile.split('@')[0];
    deleteDirFilesUsingPattern(prevFileName, fileStorage);
  }
  const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
      return callBack(null, fileStorage);
    },
    filename: (req, file, callBack) => {
      let ext = path.extname(file.originalname).split('.')[1];
      let fileName = file.originalname.split('.')[0];
      let mediaLink = `${fileName}-${randStr}@${Date.now()}.${ext}`;
      return callBack(null, mediaLink);
    },
  });
  const upload = multer({
    storage,
    limits: { fileSize: ACCEPTED_FILE_SIZE },
    fileFilter: (req, file, filterCallBack) => {
      isFileAllowed(file, fileStorage, (error, allowed) => {
        return filterCallBack(error, allowed);
      });
    },
  }).array('productFiles', 2);

  upload(req, res, (uploadError) => {
    if (uploadError instanceof multer.MulterError || uploadError) {
      const errorMsg = uploadError.message || uploadError;
      return serverResponse(res, 500, errorMsg);
    }
    if (!req.files?.length) {
      return serverResponse(res, 400, 'No file selected');
    }
    const fileName = req.files[0].filename.split('@')[0];
    return serverResponse(res, 200, 'Files uploaded', fileName);
  });
};
