import { Router } from 'express';
import { uploadFiles } from '../../utils/file.uploader';
import {
  getProducts,
  addNewProduct,
  editProduct,
  deleteProduct,
} from './product.controller';
import {
  doesProductExist,
  isProductValid,
} from './product.middleware';

const productRouter = Router();

productRouter.post('/', isProductValid, addNewProduct);
productRouter.get('/', getProducts);
productRouter.patch(
  '/:productId',
  doesProductExist,
  isProductValid,
  editProduct,
);
productRouter.delete('/:productId', doesProductExist, deleteProduct);
productRouter.post('/upload', uploadFiles);

export default productRouter;
