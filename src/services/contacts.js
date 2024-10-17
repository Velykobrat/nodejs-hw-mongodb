// src/services/contacts.js

import Contact from '../db/models/contact.js';

// Підрахунок загальної кількості контактів з урахуванням фільтрації
export const countContacts = async (filter = {}) => {
    try {
        return await Contact.countDocuments(filter);
    } catch (error) {
        throw new Error('Error counting contacts: ' + error.message);
    }
};

// Отримання контактів з урахуванням пагінації, сортування та фільтрації
export const getContactsByPage = async (page, perPage, sortBy, sortOrder, filter = {}) => {
    try {
        const skip = (page - 1) * perPage;
        const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

        return await Contact.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(perPage);
    } catch (error) {
        throw new Error('Error retrieving contacts: ' + error.message);
    }
};

// Сервіс для отримання всіх контактів
export const getAllContacts = async (userId) => {
    try {
        const contacts = await Contact.find({ userId }); // Фільтрація за userId
        return contacts;
    } catch (error) {
        throw new Error('Error retrieving contacts: ' + error.message);
    }
};

// Сервіс для отримання контакту за ID
export const getContactById = async (contactId, userId) => {
    try {
        const contact = await Contact.findOne({ _id: contactId, userId }); // Фільтрація за userId
        if (!contact) {
            throw new Error('Contact not found');
        }
        return contact;
    } catch (error) {
        throw new Error('Error retrieving contact: ' + error.message);
    }
};

// Сервіс для створення нового контакту
export const createContact = async (contactData) => {
    console.log('Creating contact with data:', contactData);

    try {
        const newContact = await Contact.create(contactData);
        console.log('Contact created successfully:', newContact);
        return newContact;
    } catch (error) {
        console.error('Error creating contact:', error);
        throw new Error('Error creating contact: ' + error.message);
    }
};

// Сервіс для оновлення існуючого контакту
export const updateContact = async (contactId, contactData) => {
    console.log('Updating contact with ID:', contactId, 'and data:', contactData);

    try {
        const updatedContact = await Contact.findByIdAndUpdate(contactId, contactData, {
            new: true,
            runValidators: true,
        });

        if (!updatedContact) {
            throw new Error('Contact not found');
        }

        console.log('Contact updated successfully:', updatedContact);

        return updatedContact;
    } catch (error) {
        console.error('Error updating contact:', error);

        if (error.name === 'CastError') {
            throw new Error('Invalid contact ID');
        }
        throw new Error('Error updating contact: ' + error.message);
    }
};

// Сервіс для видалення контакту
export const deleteContact = async (contactId, userId) => {
    try {
        const deletedContact = await Contact.findOneAndDelete({ _id: contactId, userId }); // Фільтрація за userId
        return deletedContact;
    } catch (error) {
        throw new Error('Error deleting contact: ' + error.message);
    }
};

// Експорт усіх сервісів
export default {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
    countContacts,
    getContactsByPage,
};
