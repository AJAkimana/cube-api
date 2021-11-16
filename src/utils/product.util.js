import MobileDetect from 'mobile-detect';
import { Reader } from '@maxmind/geoip2-node';
import ProductVisit from '../modules/product/productVisit.model';
// import { getRequestIp } from './helpers';
import ProductClick from '../modules/product/productClick.model';

/**
 *
 * @param {Request} req
 * @param {*} product
 * @param {string} analyticType
 *
 * @returns {Promise<any>}
 */
export const createAnalytics = async (
  req,
  product,
  analyticType = 'visit',
) => {
  try {
    const md = new MobileDetect(req.headers['user-agent']);
    const reader = await Reader.open(process.env.GEOIP_PATH);
    const city = reader.city(req.ip);
    const analyticBody = {
      product: product._id,
      project: product.project,
      device: md.os() || 'Desktop',
      country: city.country.names.en,
      city: city.city.names.en,
    };
    let newAnalytic;
    if (analyticType === 'click') {
      newAnalytic = await ProductClick.create(analyticBody);
    } else {
      newAnalytic = await ProductVisit.create(analyticBody);
    }
    return newAnalytic;
  } catch (error) {
    throw error;
  }
};
