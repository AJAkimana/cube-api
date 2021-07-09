import { schemaErrors } from '../../utils/helpers';
import { serverResponse } from '../../utils/response';
import { productSchema } from '../../utils/schema/product.schema';
import Product from './product.model';

export const doesProductExist = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (product) return next();
    return serverResponse(res, 400, 'Product not found');
  } catch (error) {
    return serverResponse(res, 500, error.message);
  }
};
export const isProductValid = (req, res, next) => {
  const errors = schemaErrors(productSchema, req.body);
  if (errors) {
    return serverResponse(res, 400, errors[0]);
  }
  return next();
};
