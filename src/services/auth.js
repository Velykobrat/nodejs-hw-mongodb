// src/services/auth.js

const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');
const User = require('../db/models/user');
const jwt = require('jsonwebtoken');
const Session = require('../db/models/session');

// Функція для реєстрації користувача
const registerUser = async (name, email, password) => {
  // Перевірка, чи існує користувач із таким email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  // Хешування пароля
  const hashedPassword = await bcrypt.hash(password, 10);

  // Створення нового користувача
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  // Збереження користувача в базі даних
  await newUser.save();

  // Повернення даних створеного користувача (без пароля)
  return newUser;
};

// Функція для аутентифікації користувача
const loginUser = async (email, password) => {
  // Перевірка, чи існує користувач
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  // Перевірка пароля
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid credentials');
  }

  // Генерація токенів
  const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

  // Видалення старої сесії, якщо вона існує
  await Session.deleteOne({ userId: user._id });

  // Створення нової сесії
  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 хв
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 днів

  const newSession = new Session({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  await newSession.save();

  return { accessToken, refreshToken };
};

module.exports = {
  registerUser,
  loginUser,
};
