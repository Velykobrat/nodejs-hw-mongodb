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

// Отримання контактів з урахуванням userId
export const getAllContacts = async (userId) => {
    try {
        return await Contact.find({ userId }); // Фільтрація за userId
    } catch (error) {
        throw new Error('Error retrieving contacts: ' + error.message);
    }
};

// Отримання конкретного контакту за його ID і userId
export const getContactById = async (contactId, userId) => {
    try {
        const contact = await Contact.findOne({ _id: contactId, userId }); // Фільтрація за contactId та userId
        if (!contact) {
            throw new Error('Contact not found');
        }
        return contact;
    } catch (error) {
        throw new Error('Error retrieving contact: ' + error.message);
    }
};

// Створення нового контакту з прив'язкою до userId
export const createContact = async (contactData, userId) => {
    console.log('Creating contact with data:', contactData);

    try {
        const newContact = await Contact.create({ ...contactData, userId }); // Додаємо userId до контакту
        console.log('Contact created successfully:', newContact);
        return newContact;
    } catch (error) {
        console.error('Error creating contact:', error);
        throw new Error('Error creating contact: ' + error.message);
    }
};

// Оновлення існуючого контакту, який належить користувачу
export const updateContact = async (contactId, contactData, userId) => {
    console.log('Updating contact with ID:', contactId, 'and data:', contactData);

    try {
        // Пошук і оновлення контакту, що належить користувачу
        const updatedContact = await Contact.findOneAndUpdate(
            { _id: contactId, userId }, // Перевіряється і ID контакту, і ID користувача
            contactData, // Передаємо лише оновлені дані
            { new: true, runValidators: true }
        );

        if (!updatedContact) {
            throw new Error('Contact not found');
        }

        console.log('Contact updated successfully:', updatedContact);

        return updatedContact;
    } catch (error) {
        console.error('Error updating contact:', error);
        throw new Error('Error updating contact: ' + error.message);
    }
};

// Видалення контакту, який належить користувачу
export const deleteContact = async (contactId, userId) => {
    try {
        const deletedContact = await Contact.findOneAndDelete({ _id: contactId, userId }); // Фільтрація за contactId та userId
        if (!deletedContact) {
            throw new Error('Contact not found');
        }
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
