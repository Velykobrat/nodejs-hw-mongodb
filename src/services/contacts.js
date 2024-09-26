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

export default {
    getAllContacts,
    getContactById,
    createContact,
};
