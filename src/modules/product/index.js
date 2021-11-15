import { Router } from 'express';
import { uploadFiles } from '../../utils/file.uploader';
import { ProductController } from './product.controller';
import authorization, {
  isAdmin,
  isAdminOrManager,
} from '../middleware/auth.middleware';
import {
  doesProductExist,
  isProductValid,
  isSiteAllowed,
} from './product.middleware';

const productRouter = Router();
const {
  getProducts,
  addNewProduct,
  editProduct,
  deleteProduct,
  getProductImages,
  updateAttributes,
  getProductDetails,
  deleteAttrImage,
} = ProductController;

productRouter.post(
  '/',
  authorization,
  isAdminOrManager,
  isProductValid,
  addNewProduct,
);
productRouter.get('/', authorization, getProducts);
productRouter.get(
  '/:productId',
  // isSiteAllowed,
  doesProductExist,
  getProductDetails,
);
productRouter.patch(
  '/:productId',
  authorization,
  doesProductExist,
  isProductValid,
  editProduct,
);
productRouter.delete(
  '/:productId',
  authorization,
  isAdmin,
  doesProductExist,
  deleteProduct,
);
productRouter.post(
  '/upload/:fileType',
  authorization,
  isAdminOrManager,
  uploadFiles,
);
productRouter.get(
  '/files/:productId',
  doesProductExist,
  getProductImages,
);
productRouter.patch(
  '/attributes/:productId',
  authorization,
  isAdminOrManager,
  doesProductExist,
  updateAttributes,
);
productRouter.delete(
  '/:productId/image/:imageFileName',
  authorization,
  isAdminOrManager,
  doesProductExist,
  deleteAttrImage,
);

export default productRouter;
