/* eslint-disable import/prefer-default-export */
import { NOT_FOUND, INTERNAL_SERVER_ERROR } from 'http-status';
import User from '../../database/model/user.model';
import Quote from '../../database/model/quote.model';
import InstanceMaintain from '../../database/maintains/instance.maintain';
import ResponseUtil from '../../utils/response.util';

export const checkSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await InstanceMaintain.findDataId(User, id);
    if (!user || user === null) {
      ResponseUtil.setError(NOT_FOUND, 'User was not found');
      return ResponseUtil.send(res);
    }
    const quoteData = await InstanceMaintain.findOneData(Quote, {
      _id: req.body.quoteId,
    });
    if (!quoteData && quoteData === null) {
      ResponseUtil.setError(NOT_FOUND, 'Quote not found');
      return ResponseUtil.send(res);
    }
  } catch (error) {
    ResponseUtil.setError(INTERNAL_SERVER_ERROR, error.toString());
    return ResponseUtil.send(res);
  }
  next();
};
