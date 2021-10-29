import moment from 'moment';
import Quote from '../../database/model/quote.model';
import Project from '../../database/model/project.schema';
import User from '../../database/model/user.model';
import Invoice from '../../database/model/invoice.model';
import invoiceHelper from '../invoice/invoice.helper';
import { logProject } from '../../utils/log.project';
import { emailTemplate } from '../../utils/validationMail';
import { sendUserEmail } from '../mail/mail.controller';
import { serverResponse } from '../../utils/response';
import { calculateAmounts } from '../../utils/helpers';

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
    const { projectId, ...restBody } = req.body;
    // const { role } = req.userData;
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
        return serverResponse(res, 404, 'Project not found');
      }
      const quote = await Quote.create({
        user: project.user,
        project: projectId,
        ...restBody,
      });
      project.status = 'approved';
      await project.save();
      // const entities = {
      //   project,
      //   user: project.user,
      //   manager: project.manager,
      //   createdBy: req.userData,
      // };
      // await logProject(
      //   entities,
      //   { quoteId: quote._id },
      //   'quote_create',
      //   role,
      // );
      return serverResponse(res, 200, 'Success');
    } catch (error) {
      return serverResponse(res, 500, error.toString());
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
      const { amounts, status, comment, billingCycle, items } =
        req.body;
      let quote = await Quote.findById(quoteId)
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
      let content = { info: comment };
      let logAction = 'quote_update';

      content.quoteId = quoteId;
      if (status === 'Pending') {
        content.details = `New Proposal - ${quote.project.name}`;
        logAction = 'quote_pending';
      }

      if (status === 'Draft' && items.length > 0) {
        content.details = 'Proposal items updated';
        content.info = items.reduce((info, item) => {
          let itemInfo = `Item name: ${item.name}, price: ${item.price},`;
          itemInfo += ` qty: ${item.quantity}<br/>`;
          return info + itemInfo;
        }, '');
      }

      if (status === 'Accepted') {
        const createdAt = moment().format('MMMM Do YYYY, HH:mm');
        let date = new Date();
        date.setHours(date.getHours() + 24);
        const invoice = {
          quote: quoteId,
          due_date: date,
          amount: amounts?.total,
          user: quote.user._id,
          billingCycle,
          project: quote.project._id,
        };
        const newInvoice = await Invoice.create(invoice);
        const pdfBody = {
          order: newInvoice,
          createdAt,
          due_date: moment(date).format('MMMM Do YYYY, HH:mm'),
          amounts,
          project: quote.project,
          customerEmail: quote.user.email,
          userId: quote.user._id,
          message: 'Pay the invoice within 24 hours',
          taxes: quote.taxes,
          isFixed: quote.isFixed,
          discount: quote.discount,
        };
        await invoiceHelper.generatePDF(pdfBody);
        logAction = 'invoice_create';
        content.details = 'Proposal approved and invoice created';
        content.invoiceId = newInvoice._id;

        //Notify admin
        const subject = 'A.R.I project update';
        let tempMail = `<b>${content.details}</b><br/>`;
        tempMail += comment || '';
        const user = await User.findOne({ role: 'Admin' });
        if (user) {
          const content = emailTemplate(user, tempMail);
          await sendUserEmail(user, subject, content);
        }
      }
      if (status === 'Declined') {
        await Project.findByIdAndUpdate(quote.project._id, {
          status: 'pending',
        });
        logAction = 'quote_declined';
        content.details =
          'Proposal declined and project set to PENDING';
      }
      if (
        req.body.tax !== quote.tax ||
        req.body.discount !== quote.discount
      ) {
        req.body.amounts = calculateAmounts(req.body);
      }
      await quote.updateOne(req.body);
      if (status !== 'Draft') {
        await logProject(entities, content, logAction, role);
      }
      return serverResponse(res, 200, 'Success', quote);
    } catch (error) {
      return serverResponse(res, 500, error.toString());
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

      let conditions = { user: userId, status: { $ne: 'Draft' } };
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
      return serverResponse(res, 200, 'Success', quotes);
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }
}

export default QuoteController;
