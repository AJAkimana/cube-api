import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import ResponseUtil from '../../utils/response.util';
import Quote from '../../database/model/quote.model';
import User from '../../database/model/user.model';
import Subscription from '../../database/model/subscription.model';
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

  /**
   * This function to handle all getting subscriptions.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} The status of all subscriptions.
   */
  static async getAllSubscription(req, res) {
    try {
      const { _id: userId, role } = req.userData;

      let conditions = { user: userId };
      if (role !== 'Client') {
        conditions = {};
      }
      const subscriptions = await Subscription.find(conditions)
        .sort({ createdAt: -1 })
        .populate({
          path: 'user',
          select: 'fullName',
          model: User,
        })
        .populate({
          path: 'quote',
          select: 'amount billingCycle',
          model: Quote,
        });
      return ResponseUtil.handleSuccessResponse(
        OK,
        'Success',
        subscriptions,
        res,
      );
    } catch (error) {
      return ResponseUtil.handleErrorResponse(
        INTERNAL_SERVER_ERROR,
        error.toString(),
        res,
      );
    }
  }
}

export default SubscriptionController;
