import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import ResponseUtil from '../../utils/response.util';
import Project from '../../database/model/project.schema';
import Invoice from '../../database/model/invoice.model';
import Quote from '../../database/model/quote.model';
import User from '../../database/model/user.model';
import Subscription from '../../database/model/subscription.model';
import Notification from '../../database/model/notification.model';

/**
 * Home controller class
 */
class HomeController {
  /**
   * @param  {object} req
   * @param  {object} res
   * @returns {object} function to retrieve counts
   */
  static async getDashboardCounts(req, res) {
    const { _id: userId, role } = req.userData;
    try {
      let conditions = { user: userId };
      if (role !== 'Client') {
        conditions = {};
      }

      const projects = await Project.countDocuments(conditions);
      const users = await User.countDocuments();
      const invoices = await Invoice.aggregate([
        { $match: conditions },
        { $group: { _id: null, amount: { $sum: '$amount' } } },
      ]);
      const subscriptions = await Subscription.countDocuments(
        conditions,
      );
      const quotes = await Quote.countDocuments(conditions);

      const counts = {
        projects,
        users,
        invoicesAmount: invoices[0]?.amount,
        subscriptions,
        quotes,
      };
      ResponseUtil.setSuccess(OK, 'Success', counts);
      return ResponseUtil.send(res);
    } catch (error) {
      return ResponseUtil.handleErrorResponse(
        INTERNAL_SERVER_ERROR,
        error.toString(),
        res,
      );
    }
  }
  /**
   * @param  {object} req
   * @param  {object} res
   * @returns {object} function to retrieve notifications
   */
  static async getNotifications(req, res) {
    const { _id: userId, role } = req.userData;
    const { hasRead = null } = req.query;
    try {
      let conditions = { user: userId };
      if (role === 'Manager') {
        conditions = { manager: userId };
      }
      if (role === 'Admin') {
        conditions = {};
      }
      if (hasRead) {
        conditions = { ...conditions, reads: { $ne: userId } };
      }
      const notifications = await Notification.find(conditions).sort({
        createdAt: -1,
      });

      ResponseUtil.setSuccess(OK, 'Success', notifications);
      return ResponseUtil.send(res);
    } catch (error) {
      return ResponseUtil.handleErrorResponse(
        INTERNAL_SERVER_ERROR,
        error.toString(),
        res,
      );
    }
  }
  static home(_req, res) {
    try {
      return ResponseUtil.handleSuccessResponse(
        OK,
        'Up and Running',
        '',
        res,
      );
    } catch (error) {
      return ResponseUtil.handleErrorResponse(
        INTERNAL_SERVER_ERROR,
        error.message,
        res,
      );
    }
  }
}

export default HomeController;
