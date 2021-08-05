import Joi from 'joi';

export const productSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Name is required',
    'string.empty': 'Name is not allowed to be empty',
  }),
  price: Joi.number().required().messages({
    'any.required': 'Price is required',
    'number.empty': 'Price is not allowed to be empty',
  }),
  sku: Joi.number().required().messages({
    'any.required': 'SKU is required',
    'number.empty': 'SKU is not allowed to be empty',
  }),
  status: Joi.string().valid('QA', 'COMPLETED').messages({
    'any.required': 'Status is required',
    'string.empty': 'Status is not allowed to be empty',
    'any.only': 'Status must be [QA, COMPLETED]',
  }),
  bgColor: Joi.string().required().messages({
    'any.required': 'Background color is required',
    'string.empty': 'Background color is not allowed to be empty',
  }),
  customer: Joi.string().required().messages({
    'any.required': 'Customer is required',
    'string.empty': 'Customer is not allowed to be empty',
  }),
  description: Joi.string().required().messages({
    'any.required': 'Description is required',
    'string.empty': 'Description is not allowed to be empty',
  }),
  project: Joi.string().optional().messages({
    'any.required': 'Project is required',
    'string.empty': 'Project is not allowed to be empty',
  }),
  image: Joi.string().optional(),
}).options({ abortEarly: false });
