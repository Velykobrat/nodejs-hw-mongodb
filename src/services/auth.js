// src/services/auth.js

import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import User from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { randomBytes } from 'crypto';
import { SMTP } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMPLATES_DIR } from '../constants/index.js'

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
  await SessionsCollection.deleteOne({ userId });
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
  const newSession = new SessionsCollection({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
  await newSession.save();

  return {
    accessToken,
    refreshToken,
    _id: newSession._id, // Додаємо sessionId
  };
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

  const session = await SessionsCollection.findOne({ refreshToken });
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
  const newSession = new SessionsCollection({ userId: user._id, accessToken, refreshToken: newRefreshToken, accessTokenValidUntil, refreshTokenValidUntil });
  await newSession.save();

  return { newAccessToken: accessToken, newRefreshToken };
};

// Функція для оновлення сесії за sessionId та refreshToken
export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({ _id: sessionId, refreshToken });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  return session;
};

// Функція для виходу користувача
export const logoutUser = async (refreshToken) => {
  await SessionsCollection.deleteOne({ refreshToken });
};


// Функція для скидання пароля
export const requestResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};

// Функція для скидання пароля
export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await User.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await User.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
