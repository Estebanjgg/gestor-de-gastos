// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Por favor, ingresa un email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, ingresa un email válido',
    ],
  },
  password: {
    type: String,
    required: [true, 'Por favor, ingresa una contraseña'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
