// src/routers/contacts.js
import express from 'express';
import { getContacts, createContact, getContactById, updateContact } from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = express.Router();

// Роут для отримання контактів
router.get('/', ctrlWrapper(getContacts));

// Роут для отримання контакту за ID
router.get('/:contactId', ctrlWrapper(getContactById));

// Роут для створення нового контакту
router.post('/', ctrlWrapper(createContact));

// Роут для оновлення існуючого контакту
router.patch('/:contactId', ctrlWrapper(updateContact));

export default router;
