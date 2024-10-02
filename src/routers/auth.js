// src/routers/auth.js

const express = require('express');
const router = express.Router();
const { register } = require('../controllers/auth');

// Роут для реєстрації
router.post('/register', register);

module.exports = router;
