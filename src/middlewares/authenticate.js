// src/middlewares/authenticate.js

import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../db/models/user.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Перевірка наявності заголовка авторизації
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, 'Authorization header missing or malformed');
    }

    const token = authHeader.split(' ')[1];

    // Перевірка та декодування токена
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw createHttpError(401, 'Access token expired');
      } else if (err.name === 'JsonWebTokenError') {
        throw createHttpError(401, 'Invalid token');
      } else {
        throw createHttpError(500, 'Token verification failed');
      }
    }

    // Пошук користувача за ID
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    req.user = user; // Додаємо користувача до req
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;

