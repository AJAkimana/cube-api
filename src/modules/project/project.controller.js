import { CREATED, INTERNAL_SERVER_ERROR, OK } from 'http-status';
import ResponseUtil from '../../utils/response.util';
import Project from '../../database/model/project.schema';
import User from '../../database/model/user.model';
import {
  logProject,
  sendEmailNotification,
} from '../../utils/log.project';
import Notification from '../../database/model/notification.model';
import { serverResponse } from '../../utils/response';

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
      const content = { info: req.body.description };
      const entities = {
        project,
        user: req.userData,
        createdBy: req.userData,
      };
      await logProject(entities, content);
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
   * @returns {object} function to retrieve project proposal
   */
  static async getProjectDetail(req, res) {
    const { id: projectId } = req.params;

    const projects = await Project.findById(projectId).populate({
      path: 'user',
      select: 'fullName firstName lastName',
      model: User,
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
      let entities = { project, createdBy: req.userData };
      let content = { info: null };
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
        content.info = req.body.description;
      }
      await logProject(entities, content, logAction, role);
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
    const { id: projectId } = req.params;

    let conditions = { project: projectId };

    const histories = await Notification.find(conditions)
      .populate({
        path: 'createdBy',
        select: 'fullName companyName',
        model: User,
      })
      .sort({
        createdAt: -1,
      });
    ResponseUtil.setSuccess(OK, 'Success', histories);
    return ResponseUtil.send(res);
  }
  /**
   * @param  {object} req
   * @param  {object} res
   * @returns {object} function to create new project log
   */
  static async createNewLog(req, res) {
    const { id: projectId } = req.params;
    const { _id: userId, role } = req.userData;
    const { title, description = null } = req.body;
    if (!title) {
      return serverResponse(
        res,
        400,
        'Description should not be empty',
      );
    }
    const project = Project.findById(projectId);

    const conditions = {
      project: projectId,
      createdBy: userId,
      isCustom: true,
    };
    const toUpdate = {
      description: title,
      content: description,
      user: project.user,
      manager: project.manager,
      userRole: role,
    };

    await Notification.findOneAndUpdate(conditions, toUpdate, {
      new: true,
      upsert: true,
    });
    const msgContent = { title, info: description };
    await sendEmailNotification('custom_log', project, msgContent);
    return serverResponse(res, 200, 'Success');
  }
}

export default ProjectController;
