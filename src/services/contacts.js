// src/services/contacts.js
import Contact from '../db/models/contact.js';

// Сервіс для отримання всіх контактів
export const getAllContacts = async () => {
    try {
        const contacts = await Contact.find(); // Отримуємо всі контакти
        return contacts;
    } catch (error) {
        throw new Error('Error retrieving contacts');
    }
};

// Сервіс для отримання контакту за ID
export const getContactById = async (contactId) => {
    try {
        const contact = await Contact.findById(contactId); // Шукаємо контакт за ID
        if (!contact) {
            throw new Error('Contact not found');
        }
        return contact;
    } catch (error) {
        throw new Error('Error retrieving contact');
    }
};

// Сервіс для створення нового контакту
export const createContact = async (contactData) => {
    try {
        const newContact = await Contact.create(contactData); // Створюємо новий контакт у базі даних
        return newContact;
    } catch (error) {
        throw new Error('Error creating contact: ' + error.message); // Включити інформацію про помилку
    }
};

export const updateContact = async (contactId, contactData) => {
    try {
        const updatedContact = await Contact.findByIdAndUpdate(contactId, contactData, {
            new: true,
            runValidators: true,
        });

        // Перевірка, чи було оновлено контакт
        if (!updatedContact) {
            throw new Error('Contact not found');
        }

        return updatedContact;
    } catch (error) {
        // Обробка помилок для некоректного ID
        if (error.name === 'CastError') {
            throw new Error('Invalid contact ID');
        }
        throw new Error('Error updating contact: ' + error.message);
    }
};

// Сервіс для видалення контакту
export const deleteContact = async (contactId) => {
    try {
        const deletedContact = await Contact.findByIdAndDelete(contactId); // Видаляємо контакт за ID
        return deletedContact; // Повертаємо видалений контакт або null, якщо не знайдено
    } catch (error) {
        throw new Error('Error deleting contact: ' + error.message);
    }
};

export default {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
};

