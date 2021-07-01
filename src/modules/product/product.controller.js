import { serverResponse } from '../../utils/response';
import Product from './product.model';

export const addNewProduct = async (req, res) => {
  const { _id: userId } = req.userData;
  req.body.user = userId;
  try {
    const newProduct = await Product.create(req.body);
    return serverResponse(res, 201, 'Created', newProduct);
  } catch (error) {
    return serverResponse(res, 500, error.message);
  }
};
export const editProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    await Product.updateOne({ _id: productId }, req.body);
    return serverResponse(res);
  } catch (error) {
    return serverResponse(res, 500, error.message);
  }
};
export const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    await Product.remove({ _id: productId });
    return serverResponse(res);
  } catch (error) {
    return serverResponse(res, 500, error.message);
  }
};
export const getProducts = async (req, res) => {
  const { _id: userId, role } = req.userData || {};

  let conditions = { user: userId };
  if (role === 'Manager') {
    conditions = { manager: userId };
  }
  if (role === 'Admin') {
    conditions = {};
  }
  try {
    const products = await Product.find(conditions);
    return serverResponse(res, 200, 'Success', products);
  } catch (error) {
    return serverResponse(res, 500, error.message);
  }
};
