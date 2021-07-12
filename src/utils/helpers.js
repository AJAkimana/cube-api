import { readdir, unlink } from 'fs';
import path, { resolve } from 'path';

export const isFileAllowed = (file, filePath, fileCallBack) => {
  const images = process.env.IMAGES_ZONE;
  // Allowed exts
  const allowedImages = /glb|usdz/;
  // Check ext
  let extname = false;
  // Check mime
  let mimetype = false;
  let errorMessage = '';
  if (filePath === images) {
    extname = allowedImages.test(
      path.extname(file.originalname).toLowerCase(),
    );
    mimetype = file.mimetype === 'application/octet-stream';
    errorMessage = 'Error: only (glb or usdz) files allowed';
  }

  if (mimetype && extname) {
    return fileCallBack(null, true);
  } else {
    return fileCallBack(errorMessage);
  }
};
const MB = 1024 * 1024;
export const ACCEPTED_FILE_SIZE = 5 * MB; //5 mbs

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
