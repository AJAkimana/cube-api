import { existsSync, mkdirSync } from 'fs';
import multer from 'multer';
import path from 'path';
import { randomBytes } from 'crypto';
import { ACCEPTED_FILE_SIZE, isFileAllowed } from './helpers';
import { serverResponse } from './response';
import Product from '../modules/product/product.model';

// eslint-disable-next-line import/prefer-default-export
export const uploadFiles = (req, res) => {
  let fileStorage = null;
  const { fileType } = req.params;
  const { prevFile, productId, imgType } = req.query;
  const randStr = randomBytes(10).toString('hex');
  let numberOfFiles = 1;
  if (fileType === 'image3d') {
    fileStorage = process.env.IMAGES_3D_ZONE;
    numberOfFiles = 2;
  } else if (fileType === 'attr-image') {
    fileStorage = process.env.IMAGES_ZONE;
  } else return serverResponse(res, 400, 'Unknown file upload');
  if (!existsSync(fileStorage)) {
    mkdirSync(fileStorage, { recursive: true });
  }
  /**
   * Delete the previous file if exist
   */
  if (prevFile) {
    // const prevFileName = prevFile.split('@')[0];
    // deleteDirFilesUsingPattern(prevFileName, fileStorage);
  }
  const storage = multer.diskStorage({
    destination: (_req, file, callBack) => {
      return callBack(null, fileStorage);
    },
    filename: (_req, file, callBack) => {
      const ext = path.extname(file.originalname).split('.')[1];
      const fileName = file.originalname.split('.')[0];
      let mediaLink = `${fileName}-${Date.now()}.${ext}`;
      if (fileStorage === process.env.IMAGES_3D_ZONE) {
        mediaLink = `${fileName}-${randStr}@${Date.now()}.${ext}`;
      }
      return callBack(null, mediaLink);
    },
  });
  const upload = multer({
    storage,
    limits: { fileSize: ACCEPTED_FILE_SIZE },
    fileFilter: (_req, file, filterCallBack) => {
      isFileAllowed(file, fileStorage, (error, allowed) => {
        return filterCallBack(error, allowed);
      });
    },
  }).array('productFiles', numberOfFiles);

  upload(req, res, async (uploadError) => {
    if (uploadError instanceof multer.MulterError || uploadError) {
      const errorMsg = uploadError.message || uploadError;
      return serverResponse(res, 500, errorMsg);
    }
    if (!req.files?.length) {
      return serverResponse(res, 400, 'No file selected');
    }
    let fileName = req.files[0].filename;
    if (productId && fileStorage === process.env.IMAGES_ZONE) {
      await Product.updateOne(
        { _id: productId },
        {
          $addToSet: {
            'image.imageFiles': {
              imageType: imgType,
              imageFileName: fileName,
              canBeDeleted: true,
            },
          },
        },
      );
    }
    if (fileStorage === process.env.IMAGES_3D_ZONE) {
      fileName = req.files[0].filename.split('@')[0];
    }
    return serverResponse(res, 200, 'Files uploaded', fileName);
  });
};
