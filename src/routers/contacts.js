// src/routers/contacts.js
import express from 'express';
import { getContacts, addContact } from '../controllers/contacts.js';

const router = express.Router();

// Роут для отримання контактів
router.get('/', getContacts);

// Роут для додавання нового контакту
router.post('/', addContact);

// Додайте інші маршрути за необхідності

export default router;
