import Joi from 'joi';

export const invoiceSchema = Joi.object({
  orderId: Joi.string().guid().required().messages({
    'any.required': 'orderId is required',
    'string.empty': 'orderId is not allowed to be empty',
  }),
  due_date: Joi.date()
    .min(new Date().toISOString().split('T')[0])
    .max(new Date().toISOString().split('T')[0])
    .required()
    .messages({
      'any.required': 'due_date is required',
      'string.empty': 'due_date is not allowed to be empty',
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
  status: Joi.string()
    .valid('pending', 'paid', 'canceled', 'admin')
    .messages({
      'any.required': 'status is required',
      'string.empty': 'status is not allowed to be empty',
    }),
  customerEmail: Joi.string().email().required().messages({
    'any.required': 'customerEmail is required',
    'string.empty': 'customerEmail is not allowed to be empty',
    'string.email': 'customerEmail must be a valid email',
  }),
}).options({ abortEarly: false });

// ================ Invoice update schema =========================

export const invoiceUpdateSchema = Joi.object({
  amount: Joi.number()
    .positive()
    .integer()
    .label('amount')
    .required()
    .messages({
      'any.required': 'amount is required',
      'string.empty': 'amount is not allowed to be empty',
    }),
  status: Joi.string().valid('paid', 'canceled').messages({
    'any.required': 'status is required',
    'string.empty': 'status is not allowed to be empty',
    'any.only': 'status must be one of [pending, paid, canceled]',
  }),
}).options({ abortEarly: false });
