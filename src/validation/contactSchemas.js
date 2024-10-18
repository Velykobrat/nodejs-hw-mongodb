// src/validation/contactSchemas.js

import Joi from 'joi';

// Схема для створення контакту
export const createContactSchema = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    phoneNumber: Joi.string().pattern(/^\+38\(\d{3}\)\d{7}$/).required(),
    email: Joi.string().email().optional(),
    isFavourite: Joi.boolean().optional(),
    contactType: Joi.string().valid('family', 'friend', 'work', 'other').required(),
});

// Схема для оновлення контакту
export const updateContactSchema = Joi.object({
    name: Joi.string().min(1).max(50).optional(),
    phoneNumber: Joi.string().pattern(/^\+38\(\d{3}\)\d{7}$/).optional(),
    email: Joi.string().email().optional(),
    isFavourite: Joi.boolean().optional(),
    contactType: Joi.string().valid('family', 'friend', 'work', 'other').optional(),
});


