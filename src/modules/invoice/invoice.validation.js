/* eslint-disable import/prefer-default-export */
import handleErrorsUtil from '../../utils/handle-errors.util';
import { invoiceSchema } from '../../utils/schema/invoice.schema';

/**
 * *Handle create account validation.
 * @param {object} req request
 * @param {object} res response
 * @param {object} next function
 * @returns {object} Object
 */
export const validateInvoiceBody = (req, res, next) => {
  return handleErrorsUtil(invoiceSchema, req.body, res, next);
};
