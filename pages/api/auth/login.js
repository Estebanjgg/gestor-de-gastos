// pages/api/auth/login.js
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

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
      // Verificar si el usuario existe
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Usuario no encontrado.' });
      }

      // Verificar la contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Contraseña incorrecta.' });
      }

      // Crear el token JWT sin incluir la contraseña
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Establecer la cookie
      res.setHeader('Set-Cookie', cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 3600, // 1 hora
        sameSite: 'strict',
        path: '/',
      }));

      res.status(200).json({ success: true, message: 'Login exitoso.' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${method} no permitido`);
  }
}
