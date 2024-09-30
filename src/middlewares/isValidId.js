// src/middleware/isValidId.js
import { isValidObjectId } from 'mongoose';
import createError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    return next(createError(400, 'Invalid contact ID'));
  }
  next();
};
