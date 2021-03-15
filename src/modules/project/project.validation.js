/* eslint-disable import/prefer-default-export */
import handleErrorsUtil from '../../utils/handle-errors.util';
import { projectSchema } from '../../utils/schema/project.schema';

/**
 * *Handle create project validation.
 * @param {object} req request
 * @param {object} res response
 * @param {object} next function
 * @returns {object} Object
 */
export const validateProjectBody = (req, res, next) => {
  return handleErrorsUtil(projectSchema, req.body, res, next);
};
