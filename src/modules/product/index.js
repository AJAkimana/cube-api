import { Router } from 'express';
import { uploadFiles } from '../../utils/file.uploader';
import { ProductController } from './product.controller';
import {
  doesProductExist,
  isProductValid,
} from './product.middleware';

const productRouter = Router();
const { getProducts, addNewProduct, editProduct, deleteProduct } =
  ProductController;

productRouter.post('/', isProductValid, addNewProduct);
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
