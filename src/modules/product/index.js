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
} = ProductController;

productRouter.post(
  '/',
  authorization,
  isAdmin,
  isProductValid,
  addNewProduct,
);
productRouter.get('/', getProducts);
productRouter.get('/:productId', getProductDetails);
productRouter.patch(
  '/:productId',
  authorization,
  isAdmin,
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
  isAdmin,
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
  // isAdmin,
  doesProductExist,
  updateAttributes,
);

export default productRouter;
