// src/middleware/validateBody.js

import createHttpError from 'http-errors';

console.log('validateBody module loaded');

export const validateBody = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next(createHttpError(400, error.details[0].message));
        }
        next();
    };
};
