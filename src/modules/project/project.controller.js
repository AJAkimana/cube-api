import {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  OK,
} from 'http-status';
import InstanceMaintain from '../../database/maintains/instance.maintain';
import ResponseUtil from '../../utils/response.util';
import Project from '../../database/model/project.schema';
import User from '../../database/model/user.model';
import { logProject } from '../../utils/log.project';
import History from '../../database/model/history.model';

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
    const { _id: userId } = req.userData;
    req.body.image = req.image;
    req.body.imageId = req.imageId;
    req.body.user = userId;
    try {
      const project = await Project.create(req.body);
      ResponseUtil.setSuccess(
        CREATED,
        'Project proposal has been created successfully',
        project,
      );
      await logProject({ project, user: req.userData });
      return ResponseUtil.send(res);
    } catch (error) {
      console.log(error);
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
      conditions = { manager: userId };
    }
    if (role === 'Admin') {
      conditions = {};
    }
    if (status) {
      conditions = { ...conditions, status: { $ne: status } };
    }
    const projects = await Project.find(conditions)
      .populate({
        path: 'user',
        select: 'fullName firstName lastName',
        model: User,
      })
      .sort({
        createdAt: -1,
      });
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
    const { role } = req.userData;
    try {
      const project = await Project.findById(id).populate({
        path: 'user',
        select: 'fullName firstName lastName',
        model: User,
      });
      let logAction = 'project_edit';
      let entities = { project };
      if (role === 'Admin') {
        project.manager = req.body.managerId;
        await project.save();
        entities.manager = { _id: req.body.managerId };
        entities.user = project.user;
        logAction = 'project_manager';
      }
      if (role === 'Manager') {
        project.status = req.body.status;
        await project.save();
        logAction = 'project_status';
        entities.manager = req.userData;
        entities.user = project.user;
      }
      if (role === 'Client') {
        await project.update(req.body);
      }
      await logProject(entities, logAction);
      ResponseUtil.setSuccess(
        OK,
        'Project proposal has been updated successfully',
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
   * @returns {object} function to retrieve project conversations
   */
  static async getProjectHistories(req, res) {
    const { projectId } = req.params;

    let conditions = { project: projectId };

    const histories = await History.find(conditions).sort({
      createdAt: -1,
    });
    ResponseUtil.setSuccess(OK, 'Success', histories);
    return ResponseUtil.send(res);
  }
}

export default ProjectController;
