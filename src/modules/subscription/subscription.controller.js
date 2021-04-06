import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import ResponseUtil from '../../utils/response.util';
import Quote from '../../database/model/quote.model';
import User from '../../database/model/user.model';
import InstanceMaintain from '../../database/maintains/instance.maintain';

/**
 * This class will contains all function to handle user subscription
 * @class This class will contains all function to handle Subscription creation
 * required to create a subsription
 */

class SubscriptionController {
  /**
   * @description this function is invoked to create subscription
   * @param {object} req request
   * @param {object} res response
   * @return {object} returns an object containing user and subscription details
   */
  static async UserSubscription(req, res) {
    try {
      const quoteData = await InstanceMaintain.findOneData(Quote, {
        _id: req.body.quoteId,
      });
      if (quoteData.billingCycle === 'Monthly') {
        const today = new Date();
        const subscription = await InstanceMaintain.findByIdAndUpdateData(
          User,
          req.params.id,
          {
            $addToSet: {
              subscription: {
                quoteId: req.body.quoteId,
                startDate: new Date(Date.now()).toISOString(),
                expirationDate: new Date(
                  new Date().setDate(today.getDate() + 30),
                ).toISOString(),
                status: req.body.status,
              },
            },
          },
        );
        ResponseUtil.setSuccess(
          OK,
          'Subscription has been created successfully',
          {
            User: subscription,
          },
        );
        return ResponseUtil.send(res);
      }
      if (quoteData.billingCycle === 'Yearly') {
        const today = new Date();
        const subscription = await InstanceMaintain.findByIdAndUpdateData(
          User,
          req.params.id,
          {
            $addToSet: {
              subscription: {
                quoteId: req.body.quoteId,
                startDate: new Date(Date.now()).toISOString(),
                expirationDate: new Date(
                  new Date().setDate(today.getDate() + 365),
                ).toISOString(),
                status: req.body.status,
              },
            },
          },
        );
        ResponseUtil.setSuccess(
          OK,
          'Subscription has been created successfully',
          {
            User: subscription,
          },
        );
        return ResponseUtil.send(res);
      }
    } catch (error) {
      ResponseUtil.setError(INTERNAL_SERVER_ERROR, error.toString());
      return ResponseUtil.send(res);
    }
  }
}

export default SubscriptionController;
