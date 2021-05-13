import handleErrorsUtil from '../../utils/handle-errors.util';
import {
  accountSchema,
  loginSchema,
  newPasswordSchema,
  passwordSchema,
  profileSchema,
} from '../../utils/schema/user.schema';

/**
 * *Handle create account validation.
 * @param {object} req request
 * @param {object} res response
 * @param {object} next function
 * @returns {object} Object
 */
export const validateUserBody = (req, res, next) => {
  const {
    fullName,
    createdAt,
    updatedAt,
    _id,
    __v,
    password,
    ...rest
  } = req.body;
  return handleErrorsUtil(accountSchema, rest, res, next);
};

/**
 * *Handle login validation.
 * @param {object} req request
 * @param {object} res response
 * @param {object} next function
 * @returns {object} Object
 */
export const validateLoginBody = (req, res, next) => {
  return handleErrorsUtil(loginSchema, req.body, res, next);
};

/**
 * * Handle secure password validation.
 * @param {object} req request
 * @param {object} res response
 * @param {object} next function
 * @returns {object} Object
 */
export const validateSecurePassword = (req, res, next) => {
  return handleErrorsUtil(passwordSchema, req.body, res, next);
};

/**
 * * Handle new password validation.
 * @param {object} req request
 * @param {object} res response
 * @param {object} next function
 * @returns {object} Object
 */
export const validateNewPassword = (req, res, next) => {
  return handleErrorsUtil(newPasswordSchema, req.body, res, next);
};

/**
 * * Handle update profile validation.
 * @param {object} req request
 * @param {object} res response
 * @param {object} next function
 * @returns {object} Object
 */
export const validateUdateProfile = (req, res, next) => {
  return handleErrorsUtil(profileSchema, req.body, res, next);
};
