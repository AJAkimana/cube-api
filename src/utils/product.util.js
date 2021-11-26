// import MobileDetect from 'mobile-detect';
import { Reader } from '@maxmind/geoip2-node';
// import { getRequestIp } from './helpers';
import ProductAnalytic from '../modules/product/productAnalytic.model';

/**
 *
 * @param {*} userAgent
 * @returns Os
 */
export const getRequestOs = (userAgent = {}) => {
  if (userAgent.isDesktop) {
    return 'Desktop';
  }
  if (userAgent.isAndroid) {
    return 'AndroidOS';
  }
  if (userAgent.isMobile && userAgent.os === 'OS X') {
    return 'iOs';
  }
  return 'Others';
};

/**
 *
 * @param {Request} req
 * @param {*} product
 *
 * @returns {Promise<any>}
 */
export const createAnalytics = async (req, product) => {
  try {
    const { analyticType = 'visit' } = req.query;
    // const md = new MobileDetect(req.headers['user-agent']);

    const reader = await Reader.open(process.env.GEOIP_PATH);
    let ipAddress = process.env.TEST_IP;
    if (process.env.NODE_ENV === 'production') {
      ipAddress = req.ip;
    }
    const city = reader.city(ipAddress);

    let analyticBody = {
      product: product._id,
      project: product.project,
      device: getRequestOs(req.useragent),
      country: city.country.names.en,
      city: city.city?.names?.en || 'Not captured',
      actionType: analyticType,
    };
    const newAnalytic = await ProductAnalytic.create(analyticBody);

    return newAnalytic;
  } catch (error) {
    throw error;
  }
};

/**
 *
 * @param {*} analytics
 * @returns
 */
export const organizeAnalytics = (analytics = []) => {
  const organized = [];
  analytics.forEach((analytic) => {
    const organizedIndex = organized.findIndex((item) =>
      item.product._id.equals(analytic.product._id),
    );
    const androids = analytic.device === 'AndroidOS' ? 1 : 0;
    const iOs = analytic.device === 'iOs' ? 1 : 0;
    const desktops = analytic.device === 'Desktop' ? 1 : 0;
    const clicks = analytic.actionType === 'click' ? 1 : 0;
    const users = analytic.actionType === 'visit' ? 1 : 0;
    if (organizedIndex < 0) {
      organized.push({
        ...analytic,
        countries: [{ name: analytic.country, count: 1 }],
        users,
        androids,
        iOs,
        desktops,
        clicks,
      });
    } else {
      organized[organizedIndex].users += users;
      organized[organizedIndex].androids += androids;
      organized[organizedIndex].iOs += iOs;
      organized[organizedIndex].desktops += desktops;
      organized[organizedIndex].clicks += clicks;
      const countryIndex = organized[
        organizedIndex
      ].countries.findIndex((el) => el.name === analytic.country);
      if (countryIndex >= 0) {
        organized[organizedIndex].countries[countryIndex].count += 1;
      } else {
        if (organized[organizedIndex].countries.length < 4) {
          organized[organizedIndex].countries.push({
            name: analytic.country,
            count: 1,
          });
        }
      }
    }
  });
  return organized;
};
