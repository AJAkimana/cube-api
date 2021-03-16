/* eslint-disable import/prefer-default-export */
import Joi from 'joi';

export const quoteSchema = Joi.object({
  projectId: Joi.string().required().messages({
    'any.required': 'projectId is required',
    'string.empty': 'projectId is not allowed to be empty',
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
