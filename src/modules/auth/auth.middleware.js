import { CONFLICT, NOT_FOUND, UNAUTHORIZED } from 'http-status';
import User from '../../database/model/user.model';
import InstanceMaintain from '../../database/maintains/instance.maintain';
import ResponseUtil from '../../utils/response.util';
import BcryptUtil from '../../utils/Bcrypt.util';

export const checkEmailExists = async (req, res, next) => {
  const { email } = req.body;
  try {
    let conditions = { email };
    if (req.method === 'PATCH') {
      const { userId } = req.params;
      conditions = { ...conditions, _id: { $ne: userId } };
    }
    const user = await User.findOne(conditions);
    if (user) {
      ResponseUtil.setError(
        CONFLICT,
        'User with this email already exist',
      );
      return ResponseUtil.send(res);
    }
    next();
  } catch (error) {
    return ResponseUtil.handleErrorResponse(
      INTERNAL_SERVER_ERROR,
      error.toString(),
      res,
    );
  }
};

export const checkPasswordCredentials = async (req, res, next) => {
  const user = await InstanceMaintain.findOneData(User, {
    email: req.body.email,
  });
  if (!user) {
    ResponseUtil.setError(NOT_FOUND, 'User not found');
    return ResponseUtil.send(res);
  }

  if (user.password) {
    ResponseUtil.setError(
      CONFLICT,
      'Error, Account is already secured with a password',
    );
    return ResponseUtil.send(res);
  }
  next();
};
export const doesUserExist = async (req, res, next) => {
  const userId = req.params.userId || req.body.userId;
  try {
    const user = await User.findById(userId);
    if (user) {
      return next();
    }
    return ResponseUtil.handleErrorResponse(
      NOT_FOUND,
      'The user does not exist',
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
export const checkUserCredential = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await InstanceMaintain.findOneData(User, { email });
  if (!user || !BcryptUtil.comparePassword(password, user.password)) {
    ResponseUtil.setError(UNAUTHORIZED, 'Invalid email or password');
    return ResponseUtil.send(res);
  }
  req.userInfo = user;
  next();
};
