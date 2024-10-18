// src/routers/auth.js

import express from 'express';
import { register, login, refresh, logout } from '../controllers/auth.js';

const router = express.Router();

router.post('/register', register); // Роут для реєстрації

router.post('/login', login); // Роут для логіну

router.post('/refresh', refresh); // Роут для оновлення сесії

router.post('/logout', logout); // Роут для логауту

export default router;
