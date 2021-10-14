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
  tax: Joi.number().required(),
  discount: Joi.number().required(),
  isFixed: Joi.boolean().required(),
  propasalText: Joi.string().required().messages({
    'any.required': 'Propasal text is required',
    'string.empty': 'Propasal text is not allowed to be empty',
  }),
  customerNote: Joi.string().required().messages({
    'any.required': 'Customer note is required',
    'string.empty': 'Customer note is not allowed to be empty',
  }),
}).options({ abortEarly: false });

// ================ Quote update schema =========================

export const quoteUpdateSchema = Joi.object({
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
  tax: Joi.number().required(),
  discount: Joi.number().required(),
  isFixed: Joi.boolean().required(),
  comment: Joi.string(),
  propasalText: Joi.string().required().messages({
    'any.required': 'Propasal text is required',
    'string.empty': 'Propasal text is not allowed to be empty',
  }),
  customerNote: Joi.string().required().messages({
    'any.required': 'Customer note is required',
    'string.empty': 'Customer note is not allowed to be empty',
  }),
  status: Joi.string().required(),
  amounts: Joi.object({
    subtotal: Joi.number(),
    tax: Joi.number(),
    discount: Joi.number(),
    total: Joi.number(),
  }),
  items: Joi.array(),
}).options({ abortEarly: false });
