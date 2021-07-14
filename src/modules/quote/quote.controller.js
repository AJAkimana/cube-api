import {
  CREATED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  OK,
} from 'http-status';
import moment from 'moment';
import ResponseUtil from '../../utils/response.util';
import Quote from '../../database/model/quote.model';
import Project from '../../database/model/project.schema';
import User from '../../database/model/user.model';
import Invoice from '../../database/model/invoice.model';
import invoiceHelper from '../invoice/invoice.helper';
import { logProject } from '../../utils/log.project';

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
    const { role } = req.userData;
    try {
      const project = await Project.findById(projectId)
        .populate({
          path: 'user',
          select: 'fullName firstName lastName',
          model: User,
        })
        .populate({
          path: 'manager',
          select: 'fullName firstName lastName',
          model: User,
        });
      if (!project) {
        ResponseUtil.setError(NOT_FOUND, 'Project not found');
        return ResponseUtil.send(res);
      }
      const quote = await Quote.create({
        user: project.user,
        project: projectId,
        billingCycle,
        amount,
      });
      project.status = 'approved';
      await project.save();
      const entities = {
        project,
        user: project.user,
        manager: project.manager,
        createdBy: req.userData,
      };
      await logProject(
        entities,
        { quoteId: quote._id },
        'quote_create',
        role,
      );

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
      const { role } = req.userData;
      const { amount, status, comment, billingCycle } = req.body;
      const quote = await Quote.findById(quoteId)
        .populate({
          path: 'user',
          select: 'email fullName',
          model: User,
        })
        .populate({
          path: 'project',
          select: 'user name type',
          model: Project,
          populate: {
            path: 'manager',
            select: 'email fullName',
            model: User,
          },
        });
      const entities = {
        project: quote.project,
        user: quote.user,
        manager: quote.project.manager,
        createdBy: req.userData,
      };
      let content = {};

      quote.amount = amount;
      quote.billingCycle = billingCycle;
      if (status) {
        quote.status = status;
        quote.comment = comment;

        content.info = comment;
      }
      await quote.save();
      if (!status) {
        content.quoteId = quoteId;
        await logProject(entities, content, 'quote_update', role);
      }
      if (status && status === 'approved') {
        let date = new Date();
        date.setHours(date.getHours() + 24);
        const invoice = {
          quote: quoteId,
          due_date: date,
          amount,
          user: quote.user._id,
          billingCycle,
          project: quote.project._id,
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
        content.details = 'Quote approved and invoice created';
        content.invoiceId = newInvoice._id;
        await logProject(entities, content, 'invoice_create', role);
      }
      if (status && status === 'declined') {
        await Project.findByIdAndUpdate(quote.project._id, {
          status: 'pending',
        });
        content.details = 'Quote declined and project set to PENDING';
        await logProject(entities, content, 'quote_status', role);
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
      if (role !== 'Client') {
        conditions = {};
      }
      const quotes = await Quote.find(conditions)
        .sort({ createdAt: -1 })
        .populate({
          path: 'project',
          select: 'name type',
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
