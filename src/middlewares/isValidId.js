// src/middleware/isValidId.js

import createHttpError from 'http-errors';
import mongoose from 'mongoose';

export const isValidId = (req, res, next) => {
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        return next(createHttpError(400, 'Невірний ID контакту'));
    }
    next();
};
