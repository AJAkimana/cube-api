import Joi from 'joi';

export const productSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Name is required',
    'string.empty': 'Name is not allowed to be empty',
  }),
  price: Joi.number().allow('').optional(),
  sku: Joi.number().allow('').optional(),
  status: Joi.string().allow('').optional(),
  bgColor: Joi.string().required().messages({
    'any.required': 'Background color is required',
    'string.empty': 'Background color is not allowed to be empty',
  }),
  customer: Joi.string().required().messages({
    'any.required': 'Customer is required',
    'string.empty': 'Customer is not allowed to be empty',
  }),
  project: Joi.string().required().messages({
    'any.required': 'Project is required',
    'string.empty': 'Project is not allowed to be empty',
  }),
  description: Joi.string().allow('').optional(),
  image: Joi.string().optional(),
}).options({ abortEarly: false });
