import { existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import { serverResponse } from '../../utils/response';
import Product from './product.model';
import User from '../../database/model/user.model';

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
      if (!existsSync(fileStorage)) {
        mkdirSync(fileStorage, { recursive: true });
      }
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
  static async getProductDetails(req, res) {
    const { productId } = req.params;
    const images3DStorage = process.env.IMAGES_3D_ZONE;
    try {
      const product = await Product.findById(productId);
      const fileName = product.image.src;
      const images = {};
      readdirSync(images3DStorage)
        .filter((file) => file.includes(fileName))
        .map((img) => {
          if (img.endsWith('.glb')) {
            images.glb = img;
          } else {
            images.usdz = img;
          }
        });
      const productObj = product.toObject();
      productObj.imagesSrc = images;

      return serverResponse(res, 200, 'success', productObj);
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
      const products = await Product.find(conditions).populate({
        path: 'customer',
        select: 'fullName companyName',
        model: User,
      });
      return serverResponse(res, 200, 'Success', products);
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }
  static async updateAttributes(req, res) {
    try {
      const { productId } = req.params;
      const product = await Product.findById(productId);

      req.body.src = product.image.src;
      product.image = req.body;
      await product.save();
      const mesg = 'Successfully updated';
      return serverResponse(res, 200, 'Success', mesg);
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }
  static async deleteAttrImage(req, res) {
    try {
      const { productId, imageFileName } = req.params;
      await Product.updateOne(
        { _id: productId },
        { $pull: { 'image.imageFiles': { imageFileName } } },
      );
      /**
       * Delete the file frm the directory
       */
      const { IMAGES_ZONE } = process.env;
      unlinkSync(`${IMAGES_ZONE}/${imageFileName}`);

      const msg = 'Image deleted';

      return serverResponse(res, 200, msg, imageFileName);
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }
}
