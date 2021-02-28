import handleErrorsUtil from '../../utils/handle-errors.util';
import {
  invoiceSchema,
  invoiceUpdateSchema,
} from '../../utils/schema/invoice.schema';

/**
 * *Handle create invoice validation.
 * @param {object} req request
 * @param {object} res response
 * @param {object} next function
 * @returns {object} Object
 */
export const validateInvoiceBody = (req, res, next) => {
  return handleErrorsUtil(invoiceSchema, req.body, res, next);
};

/**
 * *Handle update invoice validation.
 * @param {object} req request
 * @param {object} res response
 * @param {object} next function
 * @returns {object} Object
 */
export const validateInvoiceUpdate = (req, res, next) => {
  return handleErrorsUtil(invoiceUpdateSchema, req.body, res, next);
};
