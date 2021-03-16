import { CREATED, OK } from 'http-status';
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
    const { name, description } = req.body;
    const project = await InstanceMaintain.createData(Project, {
      userId: req.userData._id,
      name,
      description,
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

  /**
   * @param  {object} req
   * @param  {object} res
   * @returns {object} function to update a project proposal
   */
  static async updateProject(req, res) {
    const { id } = req.params;
    // const { status, descriptions } = req.body;
    const project = await InstanceMaintain.findByIdAndUpdateData(
      Project,
      id,
      req.body,
    );
    ResponseUtil.setSuccess(
      OK,
      'Project proposal has been updated successfully',
      project,
    );
    return ResponseUtil.send(res);
  }
}

export default ProjectController;
