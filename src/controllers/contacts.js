// src/controllers/contacts.js
import createError from 'http-errors';
import contactsService from '../services/contacts.js';

// Контролер для отримання всіх контактів
export const getContacts = async (req, res, next) => {
    try {
        const contacts = await contactsService.getAllContacts();
        res.json(contacts);
    } catch (error) {
        next(createError(500, error.message));
    }
};

// Контролер для створення нового контакту
export const createContact = async (req, res, next) => {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    if (!name || !phoneNumber || !contactType) {
        return next(createError(400, 'Missing required fields: name, phoneNumber, or contactType'));
    }

    try {
        const newContact = await contactsService.createContact({
            name,
            phoneNumber,
            email,
            isFavourite,
            contactType,
        });

        res.status(201).json({
            status: 201,
            message: "Successfully created a contact!",
            data: newContact,
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

// Контролер для отримання контакту за ID
export const getContactById = async (req, res, next) => {
    const { contactId } = req.params;
    try {
        const contact = await contactsService.getContactById(contactId);
        if (!contact) {
            return next(createError(404, 'Contact not found'));
        }
        res.json(contact);
    } catch (error) {
        next(createError(500, error.message));
    }
};

// Контролер для оновлення існуючого контакту
export const updateContact = async (req, res, next) => {
    const { contactId } = req.params;
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    try {
        // Спробуйте знайти та оновити контакт
        const updatedContact = await contactsService.updateContact(contactId, {
            name,
            phoneNumber,
            email,
            isFavourite,
            contactType,
        });

        // Перевірте, чи контакт знайдено
        if (!updatedContact) {
            return next(createError(404, 'Contact not found'));
        }

        res.status(200).json({
            status: 200,
            message: "Successfully patched a contact!",
            data: updatedContact,
        });
    } catch (error) {
        // Логування помилки для відладки
        console.error("Error updating contact:", error);
        // Перевірка на помилку через неправильний формат ID
        if (error.name === 'CastError') {
            return next(createError(400, 'Invalid contact ID'));
        }
        next(createError(500, error.message));
    }
};

// Контролер для видалення контакту
export const deleteContact = async (req, res, next) => {
    const { contactId } = req.params;

    try {
        const deletedContact = await contactsService.deleteContact(contactId);
        if (!deletedContact) {
            return next(createError(404, 'Contact not found'));
        }

        res.status(204).send(); // Відповідь без тіла
    } catch (error) {
        next(createError(500, error.message));
    }
};
