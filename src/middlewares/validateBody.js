// src/middleware/validateBody.js
import Joi from 'joi';
import createError from 'http-errors';

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(createError(400, error.details[0].message));
    }
    next();
  };
};
