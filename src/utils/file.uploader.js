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
  const randStr = randomBytes(10).toString('base64');
  if (fileType === 'image') {
    fileStorage = process.env.IMAGES_ZONE;
  } else return serverResponse(res, 400, 'Unknown file upload');
  /**
   * Delete the previous file if exist
   */
  if (!existsSync(fileStorage)) {
    mkdirSync(fileStorage, { recursive: true });
  }
  if (prevFile) {
    const prevFileName = prevFile.split('@')[0];
    deleteDirFilesUsingPattern(prevFileName, fileStorage);
  }
  console.log('Req.file', req.files);
  const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
      console.log('file=storage===>', file);
      return callBack(null, fileStorage);
    },
    filename: (req, file, callBack) => {
      console.log('file=filename===>', file);
      let ext = path.extname(file.originalname).split('.')[1];
      let fileName = file.originalname.split('.')[0];
      let mediaLink = `${fileName}-${randStr}@${Date.now()}.${ext}`;
      return callBack(null, mediaLink);
    },
  });
  const upload = multer({
    storage,
    limits: { fileSize: ACCEPTED_FILE_SIZE },
    // fileFilter: (req, file, filterCallBack) => {
    //   console.log('file=filter===>', file);
    //   isFileAllowed(file, fileStorage, (error, allowed) => {
    //     return filterCallBack(error, allowed);
    //   });
    // },
  }).array('productFiles', 10);

  upload(req, res, (uploadError) => {
    console.log('uploadError', uploadError);
    if (uploadError instanceof multer.MulterError || uploadError) {
      const errorMsg = uploadError.message || uploadError;
      return serverResponse(res, 500, errorMsg);
    }
    console.log('Req.files', req.files);
    if (!req.files?.length)
      return serverResponse(res, 400, 'No file selected');
    // const fileName = req.file.filename;
    return serverResponse(res, 200, 'File(s) uploaded');
  });
};
