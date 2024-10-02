// src/controllers/auth.js

const createHttpError = require('http-errors');
const { registerUser } = require('../services/auth');

// Контролер для обробки POST /auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Валідація отриманих даних
    if (!name || !email || !password) {
      throw createHttpError(400, 'All fields are required');
    }

    // Виклик сервісу для реєстрації користувача
    const newUser = await registerUser(name, email, password);

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
};
