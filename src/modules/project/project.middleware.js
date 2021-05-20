import {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
} from 'http-status';
import InstanceMaintain from '../../database/maintains/instance.maintain';
import User from '../../database/model/user.model';
import Project from '../../database/model/project.schema';
import ResponseUtil from '../../utils/response.util';

export const checkUserRole = async (req, res, next) => {
  const user = await InstanceMaintain.findOneData(User, {
    _id: req.userData._id,
  });

  if (user && user.role === 'visitor') {
    ResponseUtil.setError(
      UNAUTHORIZED,
      'Only a client can request a project',
    );
    return ResponseUtil.send(res);
  }
  next();
};
export const doesProjectExist = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) return next();
    return ResponseUtil.handleErrorResponse(
      NOT_FOUND,
      'Project not found',
      res,
    );
  } catch (error) {
    return ResponseUtil.handleErrorResponse(
      INTERNAL_SERVER_ERROR,
      error.toString(),
      res,
    );
  }
};
export const checkUserRoleAndProjectExists = async (
  req,
  res,
  next,
) => {
  const user = await InstanceMaintain.findOneData(User, {
    _id: req.userData._id,
  });

  if (user && user.role === 'visitor') {
    ResponseUtil.setError(
      UNAUTHORIZED,
      'Only a client can request a project',
    );
    return ResponseUtil.send(res);
  }
  // const { id } = req.params;
  const project = await InstanceMaintain.findOneData(Project, {
    _id: req.params.id,
  });
  if (!project && project === null) {
    ResponseUtil.setError(NOT_FOUND, 'Project has not been found');
    return ResponseUtil.send(res);
  }
  next();
};

export const checkManagerRoleAndProjectExists = async (
  req,
  res,
  next,
) => {
  const user = await InstanceMaintain.findOneData(User, {
    _id: req.userData._id,
  });

  if (user && user.role !== 'Manager') {
    ResponseUtil.setError(
      UNAUTHORIZED,
      'Only a manager can approve a project',
    );
    return ResponseUtil.send(res);
  }
  // const { id } = req.params;
  const project = await InstanceMaintain.findOneData(Project, {
    _id: req.params.id,
  });
  if (!project && project === null) {
    ResponseUtil.setError(NOT_FOUND, 'Project has not been found');
    return ResponseUtil.send(res);
  }
  next();
};
