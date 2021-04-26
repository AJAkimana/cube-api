import {
  INTERNAL_SERVER_ERROR,
  CREATED,
  OK,
  NOT_FOUND,
} from 'http-status';
import InstanceMaintain from '../../database/maintains/instance.maintain';
import Invoice from '../../database/model/invoice.model';
import User from '../../database/model/user.model';
import Quote from '../../database/model/quote.model';
import Subscription from '../../database/model/subscription.model';
import ResponseUtil from '../../utils/response.util';
import invoiceHelper from './invoice.helper';

/**
 * This class will contains all function to handle account
 * required to create account for now
 */
class InvoiceController {
  /**
   * This function to handle generate invoice request.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} The status and some data of created account.
   */
  static async generateInvoice(req, res) {
    try {
      req.body.order = req.body.orderId;
      await invoiceHelper.generatePDF(req.body);
      const data = await InstanceMaintain.createData(
        Invoice,
        req.body,
      );
      ResponseUtil.setSuccess(
        CREATED,
        'Invoice generated successfully, check your email',
        data,
      );
      return ResponseUtil.send(res);
    } catch (error) {
      ResponseUtil.setError(INTERNAL_SERVER_ERROR, error.toString());
      return ResponseUtil.send(res);
    }
  }

  /**
   * @description this function is invoked to pay invoice
   * @param {object} req request
   * @param {object} res response
   * @return {object} returns an object containing invoice and order details
   */
  static async paymentOfInvoice(req, res) {
    try {
      const { id } = req.params;
      const { amount, status } = req.body;
      // get invoice id to be updated
      const invoice = await Invoice.findById(id).populate({
        path: 'quote',
        select: 'billingCycle',
        model: Quote,
      });
      if (invoice && invoice.quote) {
        invoice.amount = amount;
        invoice.status = status;
        await invoice.save();
        if (status === 'paid') {
          const date = new Date();
          const period =
            invoice.quote.billingCycle === 'Monthly' ? 30 : 365;
          date.setDate(date.getDate() + period);

          const newSubscription = {
            quote: invoice.quote._id,
            startDate: new Date(),
            expirationDate: date,
            status,
            user: invoice.user,
          };
          await Subscription.create(newSubscription);
        }
        return ResponseUtil.handleSuccessResponse(
          OK,
          'Success',
          invoice,
          res,
        );
      }
      return ResponseUtil.handleErrorResponse(
        NOT_FOUND,
        'Invoice not found',
        res,
      );
    } catch (error) {
      ResponseUtil.setError(INTERNAL_SERVER_ERROR, error.toString());
      return ResponseUtil.send(res);
    }
  }

  /**
   * This function to handle all getting invoices.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} The status of all invoices.
   */
  static async getAllInvoices(req, res) {
    try {
      const { _id: userId, role } = req.userData;

      let conditions = { user: userId };
      if (role === 'Manager') {
        conditions = {};
      }
      const invoices = await Invoice.find(conditions).populate({
        path: 'user',
        select: 'fullName',
        model: User,
      });
      return ResponseUtil.handleSuccessResponse(
        OK,
        'All invoices have been retrieved',
        invoices,
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

export default InvoiceController;
