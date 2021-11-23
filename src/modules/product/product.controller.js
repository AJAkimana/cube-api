import moment from 'moment';
import { existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import { serverResponse } from '../../utils/response';
import Product from './product.model';
import User from '../../database/model/user.model';
import Project from '../../database/model/project.schema';
import ProjectProduct from './projectProduct.model';
import { logProject } from '../../utils/log.project';
import {
  createAnalytics,
  organizeAnalytics,
} from '../../utils/product.util';
import ProductAnalytic from './productAnalytic.model';

export class ProductController {
  static async addNewProduct(req, res) {
    const { role } = req.userData || {};
    const { project, website, domainName } = req.body;
    try {
      req.body.image = { src: req.body.image };
      const newProduct = await Product.create(req.body);
      await ProjectProduct.create({
        project,
        website,
        domainName,
        product: newProduct._id,
      });
      const theProject = await Project.findById(project);
      let logAction = 'asset_add';
      let entities = {
        project: theProject,
        createdBy: req.userData,
        manager: { _id: theProject.manager },
        user: { _id: theProject.user },
      };
      let content = {
        title: '3D asset added',
        info: '3D asset added',
      };
      await logProject(entities, content, logAction, role);
      return serverResponse(res, 201, 'Created', newProduct);
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }
  static async editProduct(req, res) {
    const { productId } = req.params;
    const { _id: userId, role } = req.userData || {};
    const { website, domainName, project } = req.body;
    const isAdmin = role === 'Admin' || role === 'Manager';
    try {
      const product = await Product.findById(productId);
      if (!isAdmin && product.customer.toString() !== userId) {
        const errorMsg = 'You are not allowed to perform the action';
        return serverResponse(res, 403, errorMsg);
      }
      const projProduct = await ProjectProduct.findOne({
        product: productId,
      });

      await product.updateOne(req.body);
      if (projProduct?.project !== project) {
        if (projProduct) {
          await projProduct.updateOne({
            project,
            website,
            domainName,
          });
        } else {
          await ProjectProduct.create({
            project,
            website,
            domainName,
            product: productId,
          });
          const theProject = await Project.findById(project);
          let logAction = 'asset_add';
          let entities = {
            project: theProject,
            createdBy: req.userData,
            manager: { _id: theProject.manager },
            user: { _id: theProject.user },
          };
          let content = {
            title: '3D asset added',
            info: '3D asset added',
          };
          await logProject(entities, content, logAction, role);
        }
      }
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
    const { analyticType } = req.query;
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
      if (analyticType) {
        await createAnalytics(req, product);
      }

      return serverResponse(res, 200, 'success', productObj);
    } catch (error) {
      console.log(error);
      return serverResponse(res, 500, error.message);
    }
  }
  static async getProducts(req, res) {
    const { _id: userId, role } = req.userData || {};
    const { project } = req.query;
    let conditions = { customer: userId };
    if (role === 'Manager' || role === 'Admin') {
      conditions = {};
    }
    if (project) {
      conditions = { ...conditions, project };
    }

    try {
      const sortOptions = { sort: [['project.name', 'asc']] };
      const products = await Product.find(conditions)
        .populate({
          path: 'customer',
          select: 'fullName companyName',
          model: User,
        })
        .populate({
          path: 'project',
          select: 'name',
          model: Project,
          sortOptions,
        })
        .sort({
          createdAt: -1,
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

  static async addProductAnalytic(req, res) {
    try {
      const { productId } = req.params;
      const product = await Product.findById(productId);

      const newClick = await createAnalytics(req, product);

      return serverResponse(res, 200, 'Success', newClick);
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }

  static async getProductAnalytics(req, res) {
    try {
      const { project, time } = req.query;
      let filters = {};
      if (project) {
        filters = { ...filters, project };
      }
      if (time && time !== 'allTime') {
        let startDate = moment().startOf('day').toDate();
        let endDate = moment().endOf('day').toDate();
        if (time === '7days') {
          startDate = moment().subtract(7, 'd').toDate();
        } else if (time === '30days') {
          startDate = moment().subtract(30, 'd').toDate();
        }
        filters = {
          ...filters,
          createdAt: { $gte: startDate, $lte: endDate },
        };
      }
      const analytics = await ProductAnalytic.find(filters)
        .populate({
          path: 'product',
          select: 'name',
          model: Product,
        })
        .lean();
      const organized = organizeAnalytics(analytics);

      return serverResponse(res, 200, 'Success', organized);
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }
}
