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
        return contact;
    } catch (error) {
        throw new Error('Error retrieving contact');
    }
};
