import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import ResponseUtil from '../../utils/response.util';
import Service from '../../database/model/service.model';
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
      const serviceData = await InstanceMaintain.findOneData(
        Service,
        {
          userId: req.params.id,
        },
      );
      if (serviceData.billingCycle === 'Monthly') {
        const today = new Date();
        const subscription = await InstanceMaintain.findByIdAndUpdateData(
          User,
          req.params.id,
          {
            $addToSet: {
              subscription: {
                serviceId: req.body.serviceId,
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
      if (serviceData.billingCycle === 'Yearly') {
        const today = new Date();
        const subscription = await InstanceMaintain.findByIdAndUpdateData(
          User,
          req.params.id,
          {
            $addToSet: {
              subscription: {
                serviceId: req.body.serviceId,
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
