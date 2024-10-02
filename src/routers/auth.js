// src/routers/auth.js

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth');

// Роут для реєстрації
router.post('/register', register);

// Роут для аутентифікації
router.post('/login', login);

module.exports = router;

