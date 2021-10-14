import { readdir, unlink } from 'fs';
import path, { resolve } from 'path';
import { Types } from 'mongoose';

export const isFileAllowed = (file, filePath, fileCallBack) => {
  const images = process.env.IMAGES_ZONE;
  const images3D = process.env.IMAGES_3D_ZONE;
  // Allowed exts
  const allowed3DImages = /glb|usdz/;
  const allowedImages = /jpeg|jpg|png/;
  // Check ext
  let extname = false;
  // Check mime
  let mimetype = false;
  let errorMessage = '';
  if (filePath === images) {
    extname = allowedImages.test(
      path.extname(file.originalname).toLowerCase(),
    );
    mimetype = allowedImages.test(file.mimetype);
    errorMessage = 'Error: only (jpeg, jpg or png) images allowed';
  }
  if (filePath === images3D) {
    extname = allowed3DImages.test(
      path.extname(file.originalname).toLowerCase(),
    );
    mimetype =
      file.mimetype === 'application/octet-stream' ||
      file.mimetype === 'model/vnd.usdz+zip';
    errorMessage = 'Error: only (glb or usdz) files allowed';
  }

  if (mimetype && extname) {
    return fileCallBack(null, true);
  } else {
    return fileCallBack(errorMessage);
  }
};
const MB = 1024 * 1024;
export const ACCEPTED_FILE_SIZE = 50 * MB; //50 mbs

export const deleteDirFilesUsingPattern = (
  pattern = 'dssd',
  dirPath = '',
) => {
  // default directory is the current directory

  // get all file names in directory
  const regPattern = new RegExp(pattern, 'g');
  readdir(resolve(dirPath), (err, fileNames) => {
    if (err) throw err;

    // iterate through the found file names
    for (const name of fileNames) {
      // if file name matches the pattern
      if (regPattern.test(name)) {
        // try to remove the file and log the result
        unlink(resolve(name), (err) => {
          if (err) throw err;
          console.log(`Deleted ${name}`);
        });
      }
    }
  });
};
export const schemaErrors = (schema, body) => {
  const { error } = schema.validate(body);

  if (error) {
    const errors = error.details.map((err) => err.message);
    return errors;
  }
  return false;
};
export const isValidObjectId = (id) => {
  if (Types.ObjectId.isValid(id)) {
    if (String(new Types.ObjectId(id)) === id) return true;
    return false;
  }
  return false;
};
export const getDomainFromUrl = (url) => {
  let result = null;
  let match = null;
  const urlRegex =
    /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im;
  if ((match = url.match(urlRegex))) {
    result = match[1];
    if ((match = result.match(/^[^\.]+\.(.+\..+)$/))) {
      result = match[1];
    }
  }
  return result;
};
export const calculateAmounts = (
  items = [],
  { tax, discount, isFixed },
) => {
  const subTotal = Number(
    items.reduce((sum, item) => sum + item.total, 0),
  );
  const totTax = (subTotal * tax) / 100;
  const totDiscount = isFixed
    ? discount
    : (subTotal * discount) / 100;
  const amounts = {
    subtotal: subTotal.toFixed(2),
    tax: totTax.toFixed(2),
    discount: totDiscount.toFixed(2),
    total: (subTotal + totTax - totDiscount).toFixed(2),
  };
  return amounts;
};
