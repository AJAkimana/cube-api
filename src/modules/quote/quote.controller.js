import {
  CREATED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  OK,
} from 'http-status';
import moment from 'moment';
import InstanceMaintain from '../../database/maintains/instance.maintain';
import ResponseUtil from '../../utils/response.util';
import Quote from '../../database/model/quote.model';
import Project from '../../database/model/project.schema';
import User from '../../database/model/user.model';
import Invoice from '../../database/model/invoice.model';
import invoiceHelper from '../invoice/invoice.helper';

/**
 * Quote controller class
 */
class QuoteController {
  /**
   * @param  {object} req
   * @param  {object} res
   * @returns {object} function to create a quote
   */
  static async createQuote(req, res) {
    const { projectId, billingCycle, amount } = req.body;
    try {
      const project = await Project.findById(projectId);
      if (!project) {
        ResponseUtil.setError(NOT_FOUND, 'Project not found');
        return ResponseUtil.send(res);
      }
      const quote = await InstanceMaintain.createData(Quote, {
        user: project.user,
        project: projectId,
        billingCycle,
        amount,
      });
      project.status = 'approved';
      await project.save();

      ResponseUtil.setSuccess(
        CREATED,
        'Quote has been created successfully',
        quote,
      );
      return ResponseUtil.send(res);
    } catch (error) {
      ResponseUtil.setError(INTERNAL_SERVER_ERROR, error.toString());
      return ResponseUtil.send(res);
    }
  }

  /**
   * @description this function is invoked to update quote
   * @param {object} req request
   * @param {object} res response
   * @return {object} returns an object containing quote updated
   */
  static async updateQuote(req, res) {
    try {
      const { id: quoteId } = req.params;
      const { amount, status, comment, billingCycle } = req.body;

      const quote = await Quote.findById(quoteId)
        .populate({
          path: 'user',
          select: 'email',
          model: User,
        })
        .populate({
          path: 'project',
          select: 'name type',
          model: Project,
        });
      quote.amount = amount;
      quote.billingCycle = billingCycle;
      if (status) {
        quote.status = status;
        quote.comment = comment;
      }
      await quote.save();
      if (status && status === 'approved') {
        let date = new Date();
        date.setHours(date.getHours() + 24);
        const invoice = {
          quote: quoteId,
          due_date: date,
          amount,
          user: quote.user._id,
        };
        const newInvoice = await Invoice.create(invoice);
        const pdfBody = {
          orderId: newInvoice._id,
          due_date: moment(date).format('MMMM Do YYYY, HH:mm'),
          amount,
          project: quote.project,
          customerEmail: quote.user.email,
          message: 'Pay the invoice within 24 hours',
        };
        await invoiceHelper.generatePDF(pdfBody);
      }
      if (status && status === 'declined') {
        await Project.findByIdAndUpdate(quote.project, {
          status: 'pending',
        });
      }
      ResponseUtil.setSuccess(
        OK,
        'Quote has been updated successfully',
        quote,
      );
      return ResponseUtil.send(res);
    } catch (error) {
      ResponseUtil.setError(INTERNAL_SERVER_ERROR, error.toString());
      return ResponseUtil.send(res);
    }
  }

  /**
   * This function to handle all getting quotes.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} The status of all quotes.
   */
  static async getAllQuotes(req, res) {
    try {
      const { _id: userId, role } = req.userData;

      let conditions = { user: userId };
      if (role === 'Manager') {
        conditions = {};
      }
      const quotes = await Quote.find(conditions)
        .populate({
          path: 'project',
          select: 'name',
          model: Project,
        })
        .populate({
          path: 'user',
          select: 'fullName',
          model: User,
        });
      return ResponseUtil.handleSuccessResponse(
        OK,
        'All quotes have been retrieved',
        quotes,
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

export default QuoteController;
