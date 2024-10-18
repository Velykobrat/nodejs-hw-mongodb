// src/validation/contactSchemas.js

import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().pattern(/^\+38\(\d{3}\)\d{7}$/).required(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().min(3).max(20).required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).optional(),
  phoneNumber: Joi.string().pattern(/^\+38\(\d{3}\)\d{7}$/).optional(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().min(3).max(20).optional(),
});
