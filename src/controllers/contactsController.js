import { getAllContacts, getContactById } from '../services/contacts.js';

// Контролер для отримання всіх контактів
export const getContacts = async (req, res) => {
    try {
        const contacts = await getAllContacts();
        res.json({
            status: 200,
            message: 'Successfully found contacts!',
            data: contacts,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching contacts',
            error: error.message,
        });
    }
};

// Контролер для отримання контакту за ID
export const getContact = async (req, res) => {
    const { contactId } = req.params;

    try {
        const contact = await getContactById(contactId);

        if (!contact) {
            return res.status(404).json({
                message: 'Contact not found',
            });
        }

        res.json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching contact',
            error: error.message,
        });
    }
};
