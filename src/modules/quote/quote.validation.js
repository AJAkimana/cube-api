import handleErrorsUtil from '../../utils/handle-errors.util';
import {
  quoteSchema,
  quoteUpdateSchema,
} from '../../utils/schema/quote.schema';

/**
 * *Handle create quote validation.
 * @param {object} req request
 * @param {object} res response
 * @param {object} next function
 * @returns {object} Object
 */
export const validateQuoteBody = (req, res, next) => {
  return handleErrorsUtil(quoteSchema, req.body, res, next);
};

/**
 * *Handle update quote validation.
 * @param {object} req request
 * @param {object} res response
 * @param {object} next function
 * @returns {object} Object
 */
export const validateQuoteUpdate = (req, res, next) => {
  delete req.body.idNumber;
  return handleErrorsUtil(quoteUpdateSchema, req.body, res, next);
};
