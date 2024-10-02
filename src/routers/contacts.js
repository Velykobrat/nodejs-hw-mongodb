// src/routers/contacts.js

import express from 'express';
import { getContacts, createContact, getContactById, updateContact, deleteContact } from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createContactSchema, updateContactSchema } from '../validation/contactSchemas.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import authenticate from '../middlewares/authenticate.js'; // Імпортуємо middleware authenticate

const router = express.Router();

// Застосування middleware authenticate до всіх роутів контактів
router.use(authenticate);

// Роут для отримання контактів
router.get('/', ctrlWrapper(getContacts));

// Роут для отримання контакту за ID
router.get('/:contactId', isValidId, ctrlWrapper(getContactById));

// Роут для створення нового контакту
router.post('/', validateBody(createContactSchema), ctrlWrapper(createContact));

// Роут для оновлення існуючого контакту
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContact));

// Роут для видалення існуючого контакту
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

export default router;
