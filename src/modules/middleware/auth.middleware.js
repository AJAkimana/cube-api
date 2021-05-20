import { UNAUTHORIZED, FORBIDDEN } from 'http-status';
import TokenUtil from '../../utils/jwt.util';
import ResponseUtil from '../../utils/response.util';

/**
 * @param  {object} req
 * @param  {object} res
 * @param  {object} next
 * @returns {object} protect route
 */
export default (req, res, next) => {
  const bearerHeader = req.headers.authorization;

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    const { name } = TokenUtil.verifyToken(req.token);

    if (name === 'JsonWebTokenError') {
      ResponseUtil.setError(
        UNAUTHORIZED,
        'Unauthorized, invalid token',
      );
      return ResponseUtil.send(res);
    }

    if (name === 'TokenExpiredError') {
      ResponseUtil.setError(
        UNAUTHORIZED,
        'Unauthorized, Token has expired signin again to get new token',
      );
      return ResponseUtil.send(res);
    }
    req.userData = TokenUtil.verifyToken(req.token);
    return next();
  } else {
    ResponseUtil.setError(
      FORBIDDEN,
      'You can not proceed without setting authorization token',
    );
    return ResponseUtil.send(res);
  }
};
/**
 * @param  {object} req
 * @param  {object} res
 * @param  {object} next
 * @returns {object} protect route
 */
export const isNotVisitor = (req, res, next) => {
  if (req.userData && req.userData.role !== 'visitor') {
    return next();
  } else {
    ResponseUtil.setError(
      UNAUTHORIZED,
      'Unauthorized, You cannot perform this action',
    );
    return ResponseUtil.send(res);
  }
};
/**
 * @param  {object} req
 * @param  {object} res
 * @param  {object} next
 * @returns {object} protect route
 */
export const isClient = (req, res, next) => {
  if (req.userData && req.userData.role === 'Client') {
    return next();
  } else {
    ResponseUtil.setError(
      UNAUTHORIZED,
      'Unauthorized, The action is for clients',
    );
    return ResponseUtil.send(res);
  }
};
/**
 * @param  {object} req
 * @param  {object} res
 * @param  {object} next
 * @returns {object} protect route
 */
export const isManager = (req, res, next) => {
  if (req.userData && req.userData.role === 'Manager') {
    return next();
  } else {
    ResponseUtil.setError(
      UNAUTHORIZED,
      'Unauthorized, The action is for managers',
    );
    return ResponseUtil.send(res);
  }
};
/**
 * @param  {object} req
 * @param  {object} res
 * @param  {object} next
 * @returns {object} protect route
 */
export const isAdmin = (req, res, next) => {
  if (req.userData && req.userData.role === 'Admin') {
    return next();
  } else {
    ResponseUtil.setError(
      UNAUTHORIZED,
      'Unauthorized, The action is for admins',
    );
    return ResponseUtil.send(res);
  }
};
