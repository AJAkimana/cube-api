import Joi from 'joi';

export const projectSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Name is required',
    'string.empty': 'Name is not allowed to be empty',
  }),
  userId: Joi.string().allow('').optional(),
  managerId: Joi.string().allow('').optional(),
  type: Joi.string()
    .required()
    .valid(
      'Cube Platform',
      '3D modeling',
      '3D Viewer',
      '3D Configurator',
      'AR',
    )
    .messages({
      'any.required': 'name is required',
      'string.empty': 'name is not allowed to be empty',
      'any.only':
        'name must be one the [Cube Platform, 3D modeling, 3D Viewer, 3D Configurator, AR]',
    }),
  nOfItems: Joi.number().required().messages({
    'any.required': 'N of items are required',
    'number.empty': 'N of items are not allowed to be empty',
  }),
  startDate: Joi.date().required().messages({
    'any.required': 'Start date is required',
    'date.empty': 'Start date is not allowed to be empty',
  }),
  dueDate: Joi.date().required().messages({
    'any.required': 'Due date is required',
    'date.empty': 'Due date is not allowed to be empty',
  }),
  budget: Joi.number().required().messages({
    'any.required': 'Budjet is required',
    'number.empty': 'Budjet is not allowed to be empty',
  }),
  status: Joi.string()
    .valid('pending', 'approved', 'canceled')
    .messages({
      'any.required': 'status is required',
      'string.empty': 'status is not allowed to be empty',
      'any.only': 'status must be [pending, approved, canceled]',
    }),
  description: Joi.string().required().min(10).messages({
    'any.required': 'Descriptions is required',
    'string.empty': 'Descriptions is not allowed to be empty',
    'string.min':
      'Descriptions length must be at least 10 characters long',
  }),
  imageId: Joi.string().optional(),
  image: Joi.string()
    .optional()
    .pattern(
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
      'link',
    ),
}).options({ abortEarly: false });

// =========== Update project Schema =========================

export const updateProjectSchema = Joi.object({
  userId: Joi.string(),
  status: Joi.string()
    .valid('pending', 'approved', 'canceled')
    .messages({
      'string.empty': 'status is not allowed to be empty',
      'any.only': 'status must be [pending,approved, canceled]',
    }),
  description: Joi.string().min(10).messages({
    'string.empty': 'Descriptions is not allowed to be empty',
    'string.min':
      'Descriptions length must be at least 10 characters long',
  }),
}).options({ abortEarly: false });

// =========== Manager Update project Schema =========================

export const managerUpdateProjectSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'approved', 'canceled')
    .messages({
      'string.empty': 'status is not allowed to be empty',
      'any.only': 'status must be [pending, approved, canceled]',
    }),
  description: Joi.string().min(10).messages({
    'string.empty': 'Descriptions is not allowed to be empty',
    'string.min':
      'Descriptions length must be at least 10 characters long',
  }),
}).options({ abortEarly: false });
