import express from 'express';
import { getContacts, getContact } from '../controllers/contactsController.js';

const router = express.Router();

// Маршрут для отримання всіх контактів
router.get('/', getContacts);

// Маршрут для отримання контакту за ID
router.get('/:contactId', getContact);

export default router;
