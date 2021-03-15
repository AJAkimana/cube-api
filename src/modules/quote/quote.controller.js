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
    const { projectId, amount } = req.body;
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
}

export default QuoteController;
