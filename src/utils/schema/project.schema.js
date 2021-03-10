/* eslint-disable import/prefer-default-export */
import Joi from 'joi';

export const projectSchema = Joi.object({
  name: Joi.string()
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
  status: Joi.string()
    .valid('pending', 'received', 'canceled')
    .messages({
      'any.required': 'status is required',
      'string.empty': 'status is not allowed to be empty',
      'any.only': 'status must be [pending, received, canceled]',
    }),
  descriptions: Joi.string().required().messages({
    'any.required': 'Descriptions is required',
    'string.empty': 'Descriptions is not allowed to be empty',
  }),
  imageId: Joi.string().optional(),
  image: Joi.string()
    .optional()
    .pattern(
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
      'link',
    ),
}).options({ abortEarly: false });
