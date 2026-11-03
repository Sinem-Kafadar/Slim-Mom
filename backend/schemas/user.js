import Joi from 'joi';

const registerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(40)
    .required()
    .messages({
      'string.empty': 'Name is required.',
      'string.min': 'Name must contain at least 2 characters.',
      'string.max': 'Name must contain at most 40 characters.',
      'any.required': 'Name is required.',
    }),

  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required.',
      'string.email': 'Please enter a valid email address.',
      'any.required': 'Email is required.',
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'Password is required.',
      'string.min': 'Password must contain at least 6 characters.',
      'any.required': 'Password is required.',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).required(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

export { registerSchema, loginSchema, refreshSchema };
