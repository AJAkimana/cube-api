import { readdirSync } from 'fs';
import { serverResponse } from '../../utils/response';
import Product from './product.model';

export class ProductController {
  static async addNewProduct(req, res) {
    try {
      req.body.image = { src: req.body.image };
      const newProduct = await Product.create(req.body);
      return serverResponse(res, 201, 'Created', newProduct);
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }
  static async editProduct(req, res) {
    const { productId } = req.params;
    try {
      await Product.updateOne({ _id: productId }, req.body);
      return serverResponse(res, 200, 'Updated');
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }
  static async deleteProduct(req, res) {
    const { productId } = req.params;
    try {
      await Product.remove({ _id: productId });
      return serverResponse(res);
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }
  static async getProductImages(req, res) {
    const { fileName } = req.body;
    const imagesStorage = process.env.IMAGES_ZONE;
    try {
      const images = {};
      readdirSync(imagesStorage)
        .filter((file) => file.includes(fileName))
        .map((img) => {
          if (img.endsWith('.glb')) {
            images.glb = img;
          } else {
            images.usdz = img;
          }
        });
      return serverResponse(res, 200, 'success', images);
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }
  static async getProducts(req, res) {
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
  }
}
