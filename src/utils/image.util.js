/* eslint-disable import/prefer-default-export */
import cloudinary from '../config/image.config';

export const uploadImage = async (req, res, next) => {
  if (!req.files) return next();
  const { tempFilePath } = req.files.image;
  const { url, public_id: pid } = await cloudinary.upload(
    tempFilePath,
  );

  req.image = url;
  req.imageId = pid;
  return next();
};
