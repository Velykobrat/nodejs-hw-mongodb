// src/services/auth.js

const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');
const User = require('../models/User');

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

module.exports = {
  registerUser,
};
