import Joi from 'joi';
import joiPhone from 'joi-phone-number';

const customJoi = Joi.extend(joiPhone);

// ================ Account scheama =========================
export const accountSchema = Joi.object({
  firstName: Joi.string().trim().min(2).required().messages({
    'any.required': 'First Name is required',
    'string.empty': 'First Name is not allowed to be empty',
    'string.min':
      'First Name length must be at least 2 characters long',
  }),
  lastName: Joi.string().trim().min(2).required().messages({
    'any.required': 'Last Name is required',
    'string.empty': 'Last Name is not allowed to be empty',
    'string.min':
      'Last Name length must be at least 2 characters long',
  }),
  companyName: Joi.string().trim().min(2).required().messages({
    'any.required': 'Company Name is required',
    'string.empty': 'Company Name is not allowed to be empty',
    'string.min':
      'Company Name length must be at least 2 characters long',
  }),
  companyUrl: Joi.string().trim().min(2).required().messages({
    'any.required': 'Company URL is required',
    'string.empty': 'Company URL is not allowed to be empty',
    'string.min':
      'Company URL length must be at least 2 characters long',
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.empty': 'Email is not allowed to be empty',
    'string.email': 'Email must be a valid email',
  }),
  phoneNumber: customJoi
    .string()
    .phoneNumber({ format: 'international', strict: true })
    .required()
    .messages({
      'any.required': 'Phone Number is required',
      'string.empty': 'Phone Number is not allowed to be empty',
      'phoneNumber.invalid':
        'Phone Number did not seem to be a phone number',
    }),
  address: Joi.string().trim().min(2).required().messages({
    'any.required': 'Address is required',
    'string.empty': 'Address is not allowed to be empty',
    'string.min': 'Address length must be at least 2 characters long',
  }),
  // role: Joi.string().required().valid('Client', 'Manager').messages({
  //   'any.required': 'role is required',
  //   'string.empty': 'role is not allowed to be empty',
  //   'any.only': 'role must be [Client, Manager]',
  // }),
  country: Joi.string().required().messages({
    'any.required': 'Country is required',
    'string.empty': 'Country is not allowed to be empty',
  }),
  city: Joi.string().required().messages({
    'any.required': 'City is required',
    'string.empty': 'City is not allowed to be empty',
  }),
  state: Joi.string().allow('').optional(),
  postalCode: Joi.string().allow('').optional(),
  linkedin: Joi.string().allow('').optional(),
  twitter: Joi.string().allow('').optional(),
  instagram: Joi.string().allow('').optional(),
  facebook: Joi.string().allow('').optional(),
}).options({ abortEarly: false });

// ================ Login scheama =========================
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.empty': 'Email is not allowed to be empty',
    'string.email': 'Email must be a valid email',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
    'string.empty': 'Password is not allowed to be empty',
  }),
}).options({ abortEarly: false });

// ================ Password scheama =========================
export const passwordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.empty': 'Email is not allowed to be empty',
    'string.email': 'Email must be a valid email',
  }),
  password: Joi.string()
    .required()
    .regex(
      /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,30}$/,
    )
    .messages({
      'any.required': 'Password is a required field',
      'string.empty': 'Password is not allowed to be empty',
      'string.pattern.base':
        'Password must be at least 8 characters long with a number, Upper and lower cases, and a special character',
    }),
}).options({ abortEarly: false });

// ================ Password scheama =========================
export const newPasswordSchema = Joi.object({
  token: Joi.string(),
  password: Joi.string()
    .required()
    .regex(
      /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,30}$/,
    )
    .messages({
      'any.required': 'Password is a required field',
      'string.empty': 'Password is not allowed to be empty',
      'string.pattern.base':
        'Password must be at least 8 characters long with a number, Upper and lower cases, and a special character',
    }),
}).options({ abortEarly: false });
// ================ Account scheama =========================
export const profileSchema = Joi.object({
  fullName: Joi.string().trim().min(2).messages({
    'string.empty': 'Full Name is not allowed to be empty',
    'string.min':
      'Full Name length must be at least 2 characters long',
  }),
  website: Joi.string().trim().min(2).messages({
    'string.empty': 'website is not allowed to be empty',
    'string.min': 'website length must be at least 2 characters long',
  }),
  companyName: Joi.string().trim().min(2).messages({
    'string.empty': 'Company Name is not allowed to be empty',
    'string.min':
      'Company Name length must be at least 2 characters long',
  }),
}).options({ abortEarly: false });
