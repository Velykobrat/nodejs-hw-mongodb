// src/controllers/contacts.js
import createError from 'http-errors';
import contactsService from '../services/contacts.js';

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
            userId: req.user._id, // Додаємо userId
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

// Контролер для отримання всіх контактів
export const getContacts = async (req, res, next) => {
    const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;
    const pageNumber = parseInt(page);
    const itemsPerPage = parseInt(perPage);

    if (!['name', 'phoneNumber', 'email'].includes(sortBy)) {
        return next(createError(400, 'Invalid sortBy parameter'));
    }
    if (!['asc', 'desc'].includes(sortOrder)) {
        return next(createError(400, 'Invalid sortOrder parameter'));
    }

    const filter = { userId: req.user._id }; // Додаємо фільтр за userId
    if (type) {
        filter.contactType = type;
    }
    if (isFavourite !== undefined) {
        filter.isFavourite = isFavourite === 'true';
    }

    try {
        const totalItems = await contactsService.countContacts(filter);
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const contacts = await contactsService.getContactsByPage(pageNumber, itemsPerPage, sortBy, sortOrder, filter);

        res.status(200).json({
            status: 200,
            message: "Successfully found contacts!",
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
        next(createError(500, error.message));
    }
};

// Контролер для отримання контакту за ID
export const getContactById = async (req, res, next) => {
    const { contactId } = req.params;
    try {
        const contact = await contactsService.getContactById(contactId, req.user._id); // Передаємо userId
        if (!contact) {
            return next(createError(404, 'Contact not found'));
        }
        res.status(200).json({
            status: 200,
            message: "Contact retrieved successfully",
            data: contact,
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

// Контролер для оновлення існуючого контакту
export const updateContact = async (req, res, next) => {
    const { contactId } = req.params;
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

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
            return next(createError(404, 'Contact not found'));
        }

        res.status(200).json({
            status: 200,
            message: "Successfully patched a contact!",
            data: updatedContact,
        });
    } catch (error) {
        console.error("Error updating contact:", error);
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
        const deletedContact = await contactsService.deleteContact(contactId, req.user._id); // Передаємо userId
        if (!deletedContact) {
            return next(createError(404, 'Contact not found'));
        }

        res.status(204).send(); // Відповідь без тіла
    } catch (error) {
        next(createError(500, error.message));
    }
};
