import { getDomainFromUrl, schemaErrors } from '../../utils/helpers';
import { serverResponse } from '../../utils/response';
import { productSchema } from '../../utils/schema/product.schema';
import Product from './product.model';
import ProjectProduct from './projectProduct.model';

export const doesProductExist = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (product) {
      if (req.method !== 'PATCH') {
        req.body.fileName = product.image.src;
      }
      return next();
    }
    return serverResponse(res, 400, 'Product not found');
  } catch (error) {
    return serverResponse(res, 500, error.message);
  }
};
export const isProductValid = (req, res, next) => {
  const { website } = req.body;
  const errors = schemaErrors(productSchema, req.body);
  if (errors) {
    return serverResponse(res, 400, errors[0]);
  }
  const webRegex =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  // console.log(website);
  if (!webRegex.test(website)) {
    const errorMsg =
      'The company has invalid website. Update it first';
    return serverResponse(res, 400, errorMsg);
  }
  req.body.domainName = getDomainFromUrl(website);
  return next();
};
export const isSiteAllowed = async (req, res, next) => {
  try {
    const ancOrigin = req.headers['ancestor-origin'];
    if (
      req.hostname === 'localhost' ||
      (req.hostname === process.env.DOMAIN_NAME && !ancOrigin)
    ) {
      return next();
    }
    const { productId } = req.params;
    let domainName = '';
    if (ancOrigin) {
      domainName = getDomainFromUrl(ancOrigin);
    }
    const product = await ProjectProduct.findOne({
      product: productId,
      domainName,
    });
    if (product) {
      return next();
    }
    const resMsg = 'Not allowed to access the product';
    return serverResponse(res, 403, resMsg);
  } catch (error) {
    return serverResponse(res, 500, error.message);
  }
};
