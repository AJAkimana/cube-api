import { Router } from 'express';
import { uploadFiles } from '../../utils/file.uploader';
import { ProductController } from './product.controller';
import {
  isAuthenticated,
  isAdminOrManager,
} from '../middleware/auth.middleware';
import {
  doesProductExist,
  isProductValid,
  // isSiteAllowed,
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
  addProductAnalytic,
  getProductAnalytics,
} = ProductController;

productRouter.post(
  '/',
  isAuthenticated,
  isAdminOrManager,
  isProductValid,
  addNewProduct,
);
productRouter.get('/', isAuthenticated, getProducts);
productRouter.get(
  '/:productId',
  // isSiteAllowed,
  doesProductExist,
  getProductDetails,
);
productRouter.patch(
  '/:productId',
  isAuthenticated,
  doesProductExist,
  isProductValid,
  editProduct,
);
productRouter.delete(
  '/:productId',
  isAuthenticated,
  isAdminOrManager,
  doesProductExist,
  deleteProduct,
);
productRouter.post(
  '/upload/:fileType',
  isAuthenticated,
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
  isAuthenticated,
  // isAdminOrManager,
  doesProductExist,
  updateAttributes,
);
productRouter.delete(
  '/:productId/image/:imageFileName',
  isAuthenticated,
  isAdminOrManager,
  doesProductExist,
  deleteAttrImage,
);
productRouter.get(
  '/get/analytics',
  isAuthenticated,
  getProductAnalytics,
);
productRouter.post(
  '/:productId/analytics',
  doesProductExist,
  addProductAnalytic,
);

export default productRouter;
