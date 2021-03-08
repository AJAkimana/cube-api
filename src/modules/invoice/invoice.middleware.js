/* eslint-disable import/prefer-default-export */
import {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
} from 'http-status';
import User from '../../database/model/user.model';
import Invoice from '../../database/model/invoice.model';
import InstanceMaintain from '../../database/maintains/instance.maintain';
import ResponseUtil from '../../utils/response.util';

export const checkInvoiceExists = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await InstanceMaintain.findOneData(User, {
      _id: req.userData._id,
    });
    if (user && user.role !== 'Manager') {
      ResponseUtil.setError(
        UNAUTHORIZED,
        'Only a manager can update an invoice',
      );
      return ResponseUtil.send(res);
    }
    const invoice = await InstanceMaintain.findDataId(Invoice, id);
    if (!invoice) {
      ResponseUtil.setError(
        NOT_FOUND,
        `${id} invoice has not been found`,
      );
      return ResponseUtil.send(res);
    }
  } catch (error) {
    ResponseUtil.setError(INTERNAL_SERVER_ERROR, error.toString());
    return ResponseUtil.send(res);
  }
  next();
};
