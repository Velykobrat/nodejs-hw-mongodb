// src/controllers/auth.js

import createHttpError from 'http-errors';
import { registerUser, loginUser, refreshSession, logoutUser, refreshUsersSession, requestResetToken, resetPassword } from '../services/auth.js';
import { ONE_DAY } from '../constants/index.js';

// Функція для встановлення сесії в cookies
const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY), // 1 день
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY), // 1 день
  });
};

// Контролер для обробки POST /auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw createHttpError(400, 'All fields are required');
    }

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

    if (!email || !password) {
      throw createHttpError(400, 'All fields are required');
    }

    const session = await loginUser(email, password);

    // Перевірка, чи сесія містить потрібні дані
    if (!session || !session.refreshToken || !session.accessToken || !session._id) {
      throw createHttpError(401, 'Login failed: Session is incomplete');
    }

    setupSession(res, session);

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: {
        accessToken: session.accessToken,
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

    if (!refreshToken) {
      throw createHttpError(400, 'Refresh token is required');
    }

    const { newAccessToken, newRefreshToken } = await refreshSession(refreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
    });

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

    await logoutUser(refreshToken);
    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Контролер для обробки оновлення сесії за sessionId та refreshToken
export const refreshUserSessionController = async (req, res, next) => {
  try {
    const sessionId = req.cookies.sessionId;
    const refreshToken = req.cookies.refreshToken;

    if (!sessionId || !refreshToken) {
      throw createHttpError(400, 'Session ID and refresh token are required');
    }

    const session = await refreshUsersSession({
      sessionId,
      refreshToken,
    });

    setupSession(res, session);

    return res.status(200).json(session);
  } catch (err) {
    return next(err);
  }
};

// Приклад контролера для логіна, що відповідає описаним вимогам
export const loginUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createHttpError(400, 'All fields are required');
    }

    const session = await loginUser(email, password);

    // Перевірка, чи сесія містить потрібні дані
    if (!session || !session.refreshToken || !session.accessToken || !session._id) {
      throw createHttpError(401, 'Login failed: Session is incomplete');
    }

    setupSession(res, session);

    res.json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};


// Контролер, який буде обробляти запит на зміну пароля
export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    message: 'Reset password email was successfully sent!',
    status: 200,
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};
