import {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
} from 'http-status';
import InstanceMaintain from '../../database/maintains/instance.maintain';
import User from '../../database/model/user.model';
import Project from '../../database/model/project.schema';
import ResponseUtil from '../../utils/response.util';
import {
  getDomainFromUrl,
  isValidObjectId,
} from '../../utils/helpers';
import { serverResponse } from '../../utils/response';

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
export const isAddProductValid = (req, res, next) => {
  const { product, website } = req.body;

  const webRegex =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  let errors = [];
  if (!isValidObjectId(product)) {
    errors.push('Please select a product');
  }
  if (!webRegex.test(website)) {
    errors.push('Enter a valid website url');
  }

  if (errors.length) {
    return serverResponse(res, 400, errors[0]);
  }
  req.body.website = website;
  req.body.domainName = getDomainFromUrl(website);
  return next();
};
