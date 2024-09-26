// src/controllers/contacts.js
import createError from 'http-errors';
import contactsService from '../services/contacts.js';

export const createContact = async (req, res, next) => {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    // Перевірка обов'язкових полів
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
        console.error('Error creating contact:', error); // Додайте це логування
        next(createError(500, error.message)); // Обробка помилки
    }
};


// Сервіс для отримання всіх контактів
export const getContacts = async (req, res, next) => {
    try {
        const contacts = await contactsService.getAllContacts();
        res.status(200).json({
            status: 200,
            data: contacts,
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

// Сервіс для отримання контакту за ID
export const getContactById = async (req, res, next) => {
    const { contactId } = req.params;

    try {
        const contact = await contactsService.getContactById(contactId);
        res.status(200).json({
            status: 200,
            data: contact,
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};
