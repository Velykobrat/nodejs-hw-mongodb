// src/controllers/contacts.js

import createError from 'http-errors';
import contactsService from '../services/contacts.js';

// Контролер для створення нового контакту
export const createContact = async (req, res) => {
    try {
        const newContact = await contactsService.createContact(req.body, req.user._id);
        return res.status(201).json(newContact);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Контролер для отримання всіх контактів
export const getContacts = async (req, res) => {
    const { page = 1, itemsPerPage = 10, sortBy = 'name', sortOrder = 'asc' } = req.query;
    const userId = req.user._id;

    try {
        const contacts = await contactsService.getContactsByPage(page, itemsPerPage, sortBy, sortOrder, { userId });
        const totalContacts = await contactsService.countContacts({ userId });
        res.status(200).json({ contacts, totalContacts });
    } catch (error) {
        console.error('Error retrieving contacts:', error);
        res.status(500).json({ message: error.message });
    }
};

// Контролер для отримання контакту за ID
export const getContactById = async (req, res, next) => {
    try {
        const contact = await contactsService.getContactById(req.params.contactId, req.user._id);
        if (!contact) return next(createError(404, 'Контакт не знайдено'));

        res.status(200).json({
            status: 200,
            message: "Контакт успішно отримано",
            data: contact,
        });
    } catch (error) {
        console.error('Помилка при отриманні контакту за ID:', error);
        next(createError(500, 'Внутрішня помилка сервера'));
    }
};

// Контролер для оновлення існуючого контакту
export const updateContact = async (req, res, next) => {
    try {
        const updatedContact = await contactsService.updateContact(req.params.contactId, { ...req.body, userId: req.user._id });
        if (!updatedContact) return next(createError(404, 'Контакт не знайдено'));

        res.status(200).json({
            status: 200,
            message: "Контакт успішно оновлено!",
            data: updatedContact,
        });
    } catch (error) {
        console.error("Помилка при оновленні контакту:", error);
        next(createError(error.name === 'CastError' ? 400 : 500, error.name === 'CastError' ? 'Невірний ID контакту' : 'Внутрішня помилка сервера'));
    }
};

// Контролер для видалення контакту
export const deleteContact = async (req, res, next) => {
    try {
        const deletedContact = await contactsService.deleteContact(req.params.contactId, req.user._id);
        if (!deletedContact) return next(createError(404, 'Контакт не знайдено'));

        res.status(200).json({
            status: 200,
            message: "Контакт успішно видалено!",
            data: deletedContact,
        });
    } catch (error) {
        console.error('Помилка при видаленні контакту:', error);
        next(createError(500, 'Внутрішня помилка сервера'));
    }
};
