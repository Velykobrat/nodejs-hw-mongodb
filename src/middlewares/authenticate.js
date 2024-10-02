// src/middlewares/authenticate.js
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../db/models/user.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, 'Authorization header missing or malformed');
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET); // Винесли декодування з колбеку

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
