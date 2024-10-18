// src/controllers/contacts.js

import createError from 'http-errors';
import contactsService from '../services/contacts.js';

// Контролер для створення нового контакту
export const createContact = async (req, res, next) => {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    console.log('Створення контакту з даними:', { name, phoneNumber, email, isFavourite, contactType });

    if (!name || !phoneNumber || !contactType) {
        return next(createError(400, 'Відсутні обов\'язкові поля: name, phoneNumber або contactType'));
    }

    try {
        const newContact = await contactsService.createContact({
            name,
            phoneNumber,
            email,
            isFavourite,
            contactType,
            userId: req.user._id, // Додаємо userId
        });

        console.log('Контакт успішно створено:', newContact);

        res.status(201).json({
            status: 201,
            message: "Контакт успішно створено!",
            data: newContact,
        });
    } catch (error) {
        console.error('Помилка при створенні контакту:', error);
        next(createError(500, error.message));
    }
};

// Контролер для отримання всіх контактів
export const getContacts = async (req, res, next) => {
    const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;

    console.log('Отримання контактів з параметрами:', { page, perPage, sortBy, sortOrder, type, isFavourite });

    const pageNumber = parseInt(page);
    const itemsPerPage = parseInt(perPage);

    if (!['name', 'phoneNumber', 'email'].includes(sortBy)) {
        return next(createError(400, 'Невірний параметр sortBy'));
    }
    if (!['asc', 'desc'].includes(sortOrder)) {
        return next(createError(400, 'Невірний параметр sortOrder'));
    }

    const filter = { userId: req.user._id };
    if (type) filter.contactType = type;
    if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

    try {
        const totalItems = await contactsService.countContacts(filter);
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const contacts = await contactsService.getContactsByPage(pageNumber, itemsPerPage, sortBy, sortOrder, filter);

        console.log('Отримані контакти:', contacts);

        res.status(200).json({
            status: 200,
            message: "Контакти успішно знайдені!",
            data: {
                data: contacts,
                page: pageNumber,
                perPage: itemsPerPage,
                totalItems,
                totalPages,
                hasPreviousPage: pageNumber > 1,
                hasNextPage: pageNumber < totalPages,
            },
        });
    } catch (error) {
        console.error('Помилка при отриманні контактів:', error);
        next(createError(500, error.message));
    }
};

// Контролер для отримання контакту за ID
export const getContactById = async (req, res, next) => {
    const { contactId } = req.params;

    console.log('Отримання контакту за ID:', contactId);

    try {
        const contact = await contactsService.getContactById(contactId, req.user._id); // Передаємо userId
        if (!contact) {
            return next(createError(404, 'Контакт не знайдено'));
        }

        console.log('Отриманий контакт:', contact);

        res.status(200).json({
            status: 200,
            message: "Контакт успішно отримано",
            data: contact,
        });
    } catch (error) {
        console.error('Помилка при отриманні контакту за ID:', error);
        next(createError(500, error.message));
    }
};

// Контролер для оновлення існуючого контакту
export const updateContact = async (req, res, next) => {
    const { contactId } = req.params;
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    console.log('Оновлення контакту з ID:', contactId, 'та даними:', { name, phoneNumber, email, isFavourite, contactType });

    try {
        const updatedContact = await contactsService.updateContact(contactId, {
            name,
            phoneNumber,
            email,
            isFavourite,
            contactType,
            userId: req.user._id, // Додаємо userId
        });

        if (!updatedContact) {
            return next(createError(404, 'Контакт не знайдено'));
        }

        console.log('Контакт успішно оновлено:', updatedContact);

        res.status(200).json({
            status: 200,
            message: "Контакт успішно оновлено!",
            data: updatedContact,
        });
    } catch (error) {
        console.error("Помилка при оновленні контакту:", error);
        if (error.name === 'CastError') {
            return next(createError(400, 'Невірний ID контакту'));
        }
        next(createError(500, error.message));
    }
};

// Контролер для видалення контакту
export const deleteContact = async (req, res, next) => {
    const { contactId } = req.params;

    console.log('Видалення контакту з ID:', contactId);

    try {
        const deletedContact = await contactsService.deleteContact(contactId, req.user._id); // Передаємо userId
        if (!deletedContact) {
            return next(createError(404, 'Контакт не знайдено'));
        }

        console.log('Контакт успішно видалено:', deletedContact);

        res.status(204).send(); // Відповідь без тіла
    } catch (error) {
        console.error('Помилка при видаленні контакту:', error);
        next(createError(500, error.message));
    }
};
