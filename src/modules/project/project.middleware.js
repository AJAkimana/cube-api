import { UNAUTHORIZED } from 'http-status';
import InstanceMaintain from '../../database/maintains/instance.maintain';
import User from '../../database/model/user.model';
import ResponseUtil from '../../utils/response.util';

// eslint-disable-next-line import/prefer-default-export
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
