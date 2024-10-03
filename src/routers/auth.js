// src/routers/auth.js

import express from 'express';
import { register, login, refresh, logout } from '../controllers/auth.js';

const router = express.Router();

// Роут для реєстрації
router.post('/register', register);

// Роут для логіну
router.post('/login', login);

// Роут для оновлення сесії
router.post('/refresh', refresh);

// Роут для логауту
router.post('/logout', logout);

export default router;
