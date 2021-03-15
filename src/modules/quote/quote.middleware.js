import { UNAUTHORIZED, NOT_FOUND } from 'http-status';
import InstanceMaintain from '../../database/maintains/instance.maintain';
import User from '../../database/model/user.model';
import Quote from '../../database/model/quote.model';
import ResponseUtil from '../../utils/response.util';

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

export const checkUserRoleAndQuoteExists = async (req, res, next) => {
  const user = await User.findOne({
    _id: req.userData._id,
  });
  const { id } = req.params;
  const quote = await InstanceMaintain.findDataId(Quote, id);

  if (user && user.role !== 'Manager') {
    ResponseUtil.setError(
      UNAUTHORIZED,
      'Only a manager can create a quote',
    );
    return ResponseUtil.send(res);
  }
  if (!quote && quote === null) {
    ResponseUtil.setError(
      NOT_FOUND,
      `${id} quote has not been found`,
    );
    return ResponseUtil.send(res);
  }
  next();
};
