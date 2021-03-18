import {
  CREATED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  OK,
} from 'http-status';
import InstanceMaintain from '../../database/maintains/instance.maintain';
import ResponseUtil from '../../utils/response.util';
import Quote from '../../database/model/quote.model';
import Project from '../../database/model/project.schema';

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
    const project = await InstanceMaintain.findDataId(Project, {
      _id: projectId,
    });
    if (!project && project === null) {
      ResponseUtil.setError(NOT_FOUND, 'Project not found');
      return ResponseUtil.send(res);
    }
    if (project) {
      const quote = await InstanceMaintain.createData(Quote, {
        userId: req.userData._id,
        projectId,
        billingCycle,
        amount,
      });
      ResponseUtil.setSuccess(
        CREATED,
        'Quote has been created successfully',
        quote,
      );
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
      const { id } = req.params;
      const { amount } = req.body;
      const updatedQuote = await InstanceMaintain.findByIdAndUpdateData(
        Quote,
        id,
        { amount },
      );
      ResponseUtil.setSuccess(
        OK,
        'Quote has been updated successfully',
        {
          Quote: updatedQuote,
        },
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
      const quotes = await InstanceMaintain.findData(Quote);
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
