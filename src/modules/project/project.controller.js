import { CREATED } from 'http-status';
import InstanceMaintain from '../../database/maintains/instance.maintain';
import ResponseUtil from '../../utils/response.util';
import Project from '../../database/model/project.schema';

/**
 * Service controller class
 */
class ProjectController {
  /**
   * @param  {object} req
   * @param  {object} res
   * @returns {object} function to create a project proposal
   */
  static async createProject(req, res) {
    const { name, status, descriptions } = req.body;
    const project = await InstanceMaintain.createData(Project, {
      userId: req.userData._id,
      name,
      status,
      descriptions,
      image: req.image,
      imageId: req.imageId,
    });
    ResponseUtil.setSuccess(
      CREATED,
      'Project proposal has been created successfully',
      project,
    );
    return ResponseUtil.send(res);
  }
}

export default ProjectController;
