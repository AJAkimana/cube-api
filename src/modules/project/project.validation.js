/* eslint-disable import/prefer-default-export */
import handleErrorsUtil from '../../utils/handle-errors.util';
import {
  projectSchema,
  updateProjectSchema,
  managerUpdateProjectSchema,
} from '../../utils/schema/project.schema';

/**
 * *Handle create project validation.
 * @param {object} req request
 * @param {object} res response
 * @param {object} next function
 * @returns {object} Object
 */
export const validateProjectBody = (req, res, next) => {
  const { role } = req.userData;
  if (role !== 'Client') return next();
  return handleErrorsUtil(projectSchema, req.body, res, next);
};

/**
 * *Handle update project validation.
 * @param {object} req request
 * @param {object} res response
 * @param {object} next function
 * @returns {object} Object
 */
export const updateProjectBody = (req, res, next) => {
  return handleErrorsUtil(updateProjectSchema, req.body, res, next);
};

/**
 * *Handle update project status.
 * @param {object} req request
 * @param {object} res response
 * @param {object} next function
 * @returns {object} Object
 */
export const updateProjectStatus = (req, res, next) => {
  return handleErrorsUtil(
    managerUpdateProjectSchema,
    req.body,
    res,
    next,
  );
};
