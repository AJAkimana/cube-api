import { CREATED, NOT_FOUND } from 'http-status';
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
}

export default QuoteController;
