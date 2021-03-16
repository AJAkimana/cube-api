import { UNAUTHORIZED } from 'http-status';
import User from '../../database/model/user.model';
import ResponseUtil from '../../utils/response.util';

// eslint-disable-next-line import/prefer-default-export
export const checkUserRole = async (req, res, next) => {
  const user = await User.findOne({
    _id: req.userData._id,
  });

  if (user && user.role !== 'Manager') {
    ResponseUtil.setError(
      UNAUTHORIZED,
      'Only a manager can create a quote',
    );
    return ResponseUtil.send(res);
  }
  next();
};
