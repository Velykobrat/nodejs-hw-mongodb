// src/validation/auth.js

import Joi from 'joi';

// Схема валідації для запиту скидання пароля
export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});
