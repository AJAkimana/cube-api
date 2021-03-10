/* eslint-disable import/prefer-default-export */
import handleErrorsUtil from '../../utils/handle-errors.util';
import { subscriptionSchema } from '../../utils/schema/subscription.schema';

/**
 * *Handle create account validation.
 * @param {object} req request
 * @param {object} res response
 * @param {object} next function
 * @returns {object} Object
 */
export const validateSubscriptionBody = (req, res, next) => {
  return handleErrorsUtil(subscriptionSchema, req.body, res, next);
};
