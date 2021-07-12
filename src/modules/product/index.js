import { Router } from 'express';
import { uploadFiles } from '../../utils/file.uploader';
import { ProductController } from './product.controller';
import authorization from '../middleware/auth.middleware';
import {
  doesProductExist,
  isProductValid,
} from './product.middleware';

const productRouter = Router();
const { getProducts, addNewProduct, editProduct, deleteProduct } =
  ProductController;

productRouter.post('/', authorization, isProductValid, addNewProduct);
productRouter.get('/', getProducts);
productRouter.patch(
  '/:productId',
  doesProductExist,
  isProductValid,
  editProduct,
);
productRouter.delete('/:productId', doesProductExist, deleteProduct);
productRouter.post('/upload/:fileType', uploadFiles);

export default productRouter;
