/* eslint-disable import/prefer-default-export */
import {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from 'http-status';
import User from '../../database/model/user.model';
import Service from '../../database/model/service.model';
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
    const serviceData = await InstanceMaintain.findOneData(Service, {
      userId: id,
    });
    if (!serviceData && serviceData === null) {
      ResponseUtil.setError(NOT_FOUND, 'Service not found');
      return ResponseUtil.send(res);
    }
    if (
      serviceData.billingCycle !== 'Monthly' &&
      serviceData.billingCycle !== 'Yearly'
    ) {
      ResponseUtil.setError(BAD_REQUEST, 'Invalid billing cycle');
      return ResponseUtil.send(res);
    }
  } catch (error) {
    ResponseUtil.setError(INTERNAL_SERVER_ERROR, error.toString());
    return ResponseUtil.send(res);
  }
  next();
};
