// src/db/models/user.js
import mongoose from 'mongoose'; // Зміна на import
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.'],
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // автоматично додає createdAt і updatedAt
);

const User = mongoose.model('User', userSchema);

export default User; 
