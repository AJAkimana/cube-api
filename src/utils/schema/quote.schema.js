/* eslint-disable import/prefer-default-export */
import Joi from 'joi';

export const quoteSchema = Joi.object({
  projectId: Joi.string().required().messages({
    'any.required': 'projectId is required',
    'string.empty': 'projectId is not allowed to be empty',
  }),
  billingCycle: Joi.string()
    .valid('Monthly', 'Yearly', 'OneTime')
    .required()
    .messages({
      'any.required': 'Billing Cycle is required',
      'string.empty': 'Billing Cycle is not allowed to be empty',
      'any.only':
        'Billing Cycle must be one of [Monthly, Yearly, OneTime]',
    }),
  amount: Joi.number()
    .positive()
    .integer()
    .label('amount')
    .required()
    .messages({
      'any.required': 'amount is required',
      'string.empty': 'amount is not allowed to be empty',
    }),
}).options({ abortEarly: false });

// ================ Quote update schema =========================

export const quoteUpdateSchema = Joi.object({
  billingCycle: Joi.string()
    .valid('Monthly', 'Yearly', 'OneTime')
    .required()
    .messages({
      'any.required': 'Billing Cycle is required',
      'string.empty': 'Billing Cycle is not allowed to be empty',
      'any.only':
        'Billing Cycle must be one of [Monthly, Yearly, OneTime]',
    }),
  amount: Joi.number()
    .positive()
    .integer()
    .label('amount')
    .required()
    .messages({
      'any.required': 'amount is required',
      'string.empty': 'amount is not allowed to be empty',
    }),
  status: Joi.string().label('status').messages({
    'any.only': 'Status must be one of [approved, declined]',
    'string.empty': 'status is not allowed to be empty',
  }),
  comment: Joi.string().label('comment').messages({
    'string.empty': 'Comment is not allowed to be empty',
  }),
}).options({ abortEarly: false });
