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
import { sendUserEmail } from '../mail/mail.controller';
import { emailTemplate } from '../../utils/validationMail';

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
    const project = await Project.findById(projectId);

    const newLog = {
      description: title,
      content: description,
      user: project.user,
      manager: project.manager,
      userRole: role,
      project: projectId,
      createdBy: userId,
      isCustom: true,
    };

    await Notification.create(newLog);
    let notifierIds = [];
    let toBeNotified = '';
    if (role === 'Manager') {
      notifierIds = [project.user];
      toBeNotified = 'User';
    }
    if (role === 'Admin') {
      notifierIds = [project.user, project.manager];
      toBeNotified = 'User and Manager';
    }
    if (role === 'Client') {
      notifierIds = [project.manager];
      toBeNotified = 'Manager';
      if (!project.manager) {
        const admin = await User.findOne({ role: 'Admin' });
        notifierIds = [admin._id];
        toBeNotified = 'Admin';
      }
    }

    const subject = 'A.R.I project update';
    let tempMail = `<b>${title}</b><br/>`;
    tempMail += `${description || ''}`;

    Promise.all(
      notifierIds.map(async (thisId) => {
        const user = await User.findById(thisId);
        if (user) {
          const content = emailTemplate(user, tempMail);
          await sendUserEmail(user, subject, content);
          // console.log(
          //   '=>Receiver to be notified:====>',
          //   toBeNotified,
          // );
        }
      }),
    )
      .then(() => {
        return serverResponse(res, 200, 'Success');
      })
      .catch(() => {
        const msg = 'Log saved, but notification not sent';
        return serverResponse(res, 200, msg);
      });
  }
}

export default ProjectController;
