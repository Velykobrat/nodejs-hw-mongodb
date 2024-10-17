// src/middlewares/authenticate.js

import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../db/models/user.js';

const authenticate = async (req, res, next) => {
   console.log("Request headers:", req.headers);
  try {
   const authHeader = req.headers['authorization'];
   console.log("Authorization header:", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("Authorization header missing or malformed");
      throw createHttpError(401, 'Authorization header missing or malformed');
    }

    const token = authHeader.split(' ')[1];

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);
    } catch (err) {
      console.log("Token verification error:", err);
      if (err.name === 'TokenExpiredError') {
        throw createHttpError(401, 'Access token expired');
      } else if (err.name === 'JsonWebTokenError') {
        throw createHttpError(401, 'Invalid token');
      } else {
        throw createHttpError(500, 'Token verification failed');
      }
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log("User not found for token:", decoded.userId);
      throw createHttpError(404, 'User not found');
    }

    req.user = user;
    console.log("User authenticated:", user);
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    next(error);
  }
};


export default authenticate;
