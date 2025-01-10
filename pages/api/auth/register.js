// pages/api/auth/register.js
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === 'POST') {
    const { email, password } = req.body;

    // Validar los campos
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email y contraseña son requeridos.' });
    }

    try {
      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'El email ya está registrado.' });
      }

      // Encriptar la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Crear el usuario
      const user = await User.create({
        email,
        password: hashedPassword,
      });

      res.status(201).json({ success: true, data: 'Usuario registrado exitosamente.' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${method} no permitido`);
  }
}
