// src/controllers/auth.js

import createHttpError from 'http-errors';
import { registerUser, loginUser, refreshSession, logoutUser } from '../services/auth.js';

// Контролер для обробки POST /auth/register
export const register = async (req, res, next) => {
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

// Контролер для обробки POST /auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Валідація отриманих даних
    if (!email || !password) {
      throw createHttpError(400, 'All fields are required');
    }

    // Виклик сервісу для аутентифікації користувача
    const { accessToken, refreshToken } = await loginUser(email, password);

    // Встановлення рефреш токена в cookies
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
    });

    // Відповідь з access токеном
    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Контролер для обробки POST /auth/refresh
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const { newAccessToken, newRefreshToken } = await refreshSession(refreshToken);

    // Оновлення рефреш токена в cookies
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
    });

    // Відповідь з новим access токеном
    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Контролер для обробки POST /auth/logout
export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(400, 'Refresh token is required');
    }

    // Видалення сесії за рефреш токеном
    await logoutUser(refreshToken);

    // Видалення рефреш токена з cookies
    res.clearCookie('refreshToken');

    // Відповідь з кодом 204 (немає вмісту)
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
