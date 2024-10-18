// src/db/models/contact.js

import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String, unique: true, trim: true },
    isFavourite: { type: Boolean, default: false },
    contactType: { type: String, enum: ['family', 'friend', 'work', 'other'], required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    photo: { type: String },
},
{
    timestamps: true,
    versionKey: false
    }
);

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
