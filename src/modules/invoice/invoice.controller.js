import {
  INTERNAL_SERVER_ERROR,
  CREATED,
  OK,
  NOT_FOUND,
} from 'http-status';
import moment from 'moment';
import InstanceMaintain from '../../database/maintains/instance.maintain';
import Invoice from '../../database/model/invoice.model';
import User from '../../database/model/user.model';
import Quote from '../../database/model/quote.model';
import Project from '../../database/model/project.schema';
import Subscription from '../../database/model/subscription.model';
import ResponseUtil from '../../utils/response.util';
import invoiceHelper from './invoice.helper';
import { logProject } from '../../utils/log.project';
import { serverResponse } from '../../utils/response';

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
      const { id: invoiceId } = req.params;
      const { amount, status } = req.body;
      const { role } = req.userData;
      // get invoice id to be updated
      const invoice = await Invoice.findById(invoiceId)
        .populate({
          path: 'quote',
          select: 'billingCycle',
          model: Quote,
        })
        .populate({
          path: 'project',
          select: 'manager user name type',
          model: Project,
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
          const expirationDate =
            invoice.quote.billingCycle === 'OneTime' ? null : date;
          const newSubscription = {
            quote: invoice.quote._id,
            startDate: new Date(),
            expirationDate,
            status,
            user: invoice.user,
            project: invoice.project._id,
            billingCycle: invoice.quote.billingCycle,
          };
          await Subscription.create(newSubscription);
          const entities = {
            project: invoice.project,
            user: { _id: invoice.user },
            manager: { _id: invoice.project.manager },
            createdBy: req.userData,
          };
          const content = {
            details:
              'Invoice status changed to PAID and subscription created',
            invoiceId,
          };
          await logProject(
            entities,
            content,
            'subscription_create',
            role,
          );
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
      if (role !== 'Client') {
        conditions = {};
      }
      const invoices = await Invoice.find(conditions)
        .sort({ createdAt: -1 })
        .populate({
          path: 'user',
          select: 'fullName',
          model: User,
        })
        .populate({
          path: 'project',
          select: 'name type',
          model: Project,
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

  /**
   * This function to handle download invoice.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} Invoice download.
   */
  static async downloadInvoice(req, res) {
    try {
      const { downloadId } = req.params;
      const { downloadType = 'invoice' } = req.query;
      let download = null;
      let message = 'Invoice';
      if (downloadType === 'invoice') {
        download = await Invoice.findById(downloadId)
          .populate({
            path: 'project',
            select: 'name type',
            model: Project,
          })
          .populate({
            path: 'quote',
            select: 'amounts',
            model: Quote,
          });
      }
      if (downloadType === 'quote') {
        download = await Quote.findById(downloadId).populate({
          path: 'project',
          select: 'name type',
          model: Project,
        });
        message = 'Proposal';
      }

      if (!download) {
        const errMsg = 'Sorry the invoice has not been generated';
        return serverResponse(res, 404, errMsg);
      }
      const pdfBody = {
        order: download,
        createdAt: moment(download.createdAt).format(
          'MMMM Do YYYY, HH:mm',
        ),
        due_date: moment(download.due_date).format(
          'MMMM Do YYYY, HH:mm',
        ),
        amounts: download?.amounts || download.quote.amounts,
        items: download.items,
        project: download.project,
        userId: download.user,
        message,
        type: downloadType,
      };
      await invoiceHelper.generatePDF(pdfBody, true);
      return res.download(`./${downloadType}.pdf`);
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }
}

export default InvoiceController;
