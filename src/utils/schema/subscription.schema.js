/* eslint-disable import/prefer-default-export */
import Joi from 'joi';

export const subscriptionSchema = Joi.object({
  quoteId: Joi.string().required().messages({
    'any.required': 'projectId is required',
    'string.empty': 'projectId is not allowed to be empty',
  }),
  startDate: Joi.date()
    .min(new Date().toISOString().split('T')[0])
    .max(new Date().toISOString().split('T')[0])
    .required()
    .messages({
      'any.required': 'startDate is required',
      'string.empty': 'startDate is not allowed to be empty',
    }),
  expiryDate: Joi.date()
    .min(new Date().toISOString().split('T')[0])
    .max(new Date().toISOString().split('T')[0])
    .messages({
      'string.empty': 'expiryDate is not allowed to be empty',
    }),
  status: Joi.string()
    .valid('active', 'expiring', 'canceled')
    .required()
    .messages({
      'any.required': 'status is required',
      'string.empty': 'status is not allowed to be empty',
      'any.only':
        'status must be one of [Active, Expiring, Canceled]',
    }),
}).options({ abortEarly: false });
