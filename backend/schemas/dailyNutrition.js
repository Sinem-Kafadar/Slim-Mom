import Joi from 'joi';

export const mealSchema = Joi.object({
  date: Joi.string()
    .isoDate()
    .required()
    .messages({
      'string.base': 'Date must be a string.',
      'string.isoDate': 'Date must be in YYYY-MM-DD format.',
      'any.required': 'Date is required.',
    }),

  product: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Product name is required.',
      'any.required': 'Product name is required.',
    }),

  grams: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Grams must be a number.',
      'number.integer': 'Grams must be an integer.',
      'number.positive': 'Grams must be greater than zero.',
      'any.required': 'Grams are required.',
    }),
});

export const dailyMealsSchema = Joi.object({
  date: Joi.string()
    .isoDate()
    .required()
    .messages({
      'string.base': 'Date must be a string.',
      'string.isoDate': 'Date must be in YYYY-MM-DD format.',
      'any.required': 'Date is required.',
    }),
});
