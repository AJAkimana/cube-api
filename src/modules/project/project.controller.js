import { CREATED, INTERNAL_SERVER_ERROR, OK } from 'http-status';
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
    req.body.user = req.userData._id;
    req.body.image = req.image;
    req.body.imageId = req.imageId;
    try {
      const project = await Project.create(req.body);
      ResponseUtil.setSuccess(
        CREATED,
        'Project proposal has been created successfully',
        project,
      );
      return ResponseUtil.send(res);
    } catch (error) {
      return ResponseUtil.handleErrorResponse(
        INTERNAL_SERVER_ERROR,
        error.toString(),
        res,
      );
    }
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @returns {object} function to retrieve project proposals
   */
  static async getProjects(req, res) {
    const { _id: userId, role } = req.userData;
    const { status } = req.query;

    let conditions = { user: userId };
    if (role === 'Manager') {
      conditions = {};
    }
    if (status) {
      conditions = { ...conditions, status };
    }
    const projects = await Project.find(conditions);
    ResponseUtil.setSuccess(OK, 'Success', projects);
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
