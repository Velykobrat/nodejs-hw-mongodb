// src/services/auth.js

import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import User from '../db/models/user.js';
import Session from '../db/models/session.js';
import { randomBytes } from 'crypto';

// Генерація токенів
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

  return { accessToken, refreshToken };
};

// Отримання терміну дії токенів
const getTokenValidityDates = () => {
  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 хв
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 днів

  return { accessTokenValidUntil, refreshTokenValidUntil };
};

// Функція для створення сесії
const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 хв
    refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 день
  };
};

// Видалення сесії за userId
const deleteSessionByUserId = async (userId) => {
  await Session.deleteOne({ userId });
};

// Функція для реєстрації користувача
export const registerUser = async (name, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  return newUser;
};

// Функція для аутентифікації користувача
export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const { accessToken, refreshToken } = generateTokens(user._id);
  await deleteSessionByUserId(user._id);

  const { accessTokenValidUntil, refreshTokenValidUntil } = getTokenValidityDates();
  const newSession = new Session({ userId: user._id, accessToken, refreshToken, accessTokenValidUntil, refreshTokenValidUntil });
  await newSession.save();

  return { accessToken, refreshToken };
};

// Функція для оновлення сесії
export const refreshSession = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(400, 'Refresh token is required');
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const user = await User.findById(payload.userId);
  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  await deleteSessionByUserId(user._id);

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
  const { accessTokenValidUntil, refreshTokenValidUntil } = getTokenValidityDates();
  const newSession = new Session({ userId: user._id, accessToken, refreshToken: newRefreshToken, accessTokenValidUntil, refreshTokenValidUntil });
  await newSession.save();

  return { newAccessToken: accessToken, newRefreshToken };
};

// Функція для оновлення сесії за sessionId та refreshToken
export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await Session.findOne({ _id: sessionId, refreshToken });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  await Session.deleteOne({ _id: sessionId, refreshToken });

  return await Session.create({
    userId: session.userId,
    ...newSession,
  });
};

// Функція для видалення сесії (логаут користувача)
export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(400, 'Refresh token is required');
  }

  const session = await Session.findOneAndDelete({ refreshToken });
  if (!session) {
    throw createHttpError(404, 'Session not found');
  }

  return true;
};
