// src/routers/auth.js

const express = require('express');
const router = express.Router();
const { register, login, refresh } = require('../controllers/auth');

// Роут для реєстрації
router.post('/register', register);

// Роут для логіну
router.post('/login', login);

// Роут для оновлення сесії
router.post('/refresh', refresh);

module.exports = router;


