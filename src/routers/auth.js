// src/routers/auth.js

import express from 'express';
import { requestResetEmailSchema } from '../validation/auth.js';
import { register, login, refresh, logout, requestResetEmailController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';



const router = express.Router();

router.post('/register', register); // Роут для реєстрації

router.post('/login', login); // Роут для логіну

router.post('/refresh', refresh); // Роут для оновлення сесії

router.post('/logout', logout); // Роут для логауту

// Pоут для скидання паролю через емейл
router.post(
  '/request-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

export default router;
