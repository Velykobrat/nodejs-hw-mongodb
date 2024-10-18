// src/middlewares/authenticate.js

import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../db/models/user.js';
import Session from '../db/models/session.js';

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Перевірка наявності заголовка Authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createHttpError(401, 'Authorization header missing or malformed'));
  }

  const token = authHeader.split(' ')[1];

  // Перевірка наявності токена
  if (!token) {
    return next(createHttpError(401, 'Token missing in Authorization header'));
  }

  // Логування токена для сесійної перевірки
  console.log('Received token for session check:', token);

  try {
    // Пошук сесії за accessToken
    const session = await Session.findOne({ accessToken: token });

    // Якщо сесія не знайдена
    if (!session) {
      return next(createHttpError(401, 'Auth token is not associated with any session!'));
    }

    // Перевірка терміну дії токена
    if (session.accessTokenValidUntil < Date.now()) {
      await Session.findOneAndDelete({ accessToken: token }); // Видалення простроченої сесії
      return next(createHttpError(401, 'Access token expired'));
    }

    // Верифікація токена
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Пошук користувача
    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(createHttpError(404, 'User not found'));
    }

    // Додавання користувача до запиту для подальшої обробки
    req.user = user;
    next();

  } catch (err) {
    // Обробка помилок токена
    if (err.name === 'TokenExpiredError') {
      await Session.findOneAndDelete({ accessToken: token }); // Видалення простроченої сесії
      return next(createHttpError(401, 'Access token expired'));
    } else if (err.name === 'JsonWebTokenError') {
      return next(createHttpError(401, 'Invalid token'));
    }

    // Якщо виникає інша помилка
    return next(createHttpError(500, 'Token verification failed'));
  }
};

export default authenticate;
