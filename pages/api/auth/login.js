import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default async function handler(req, res) {
  const { method } = req;

  // Conectar a la base de datos
  await dbConnect();

  if (method === 'POST') {
    const { email, password } = req.body;

    // Validar los campos
    if (!email || !password) {
      console.error('Email o contraseña no proporcionados.');
      return res.status(400).json({ success: false, message: 'Email y contraseña son requeridos.' });
    }

    try {
      // Verificar si el usuario existe
      const user = await User.findOne({ email });
      if (!user) {
        console.error('Usuario no encontrado:', email);
        return res.status(400).json({ success: false, message: 'Usuario no encontrado.' });
      }

      // Verificar la contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.error('Contraseña incorrecta para el usuario:', email);
        return res.status(400).json({ success: false, message: 'Contraseña incorrecta.' });
      }

      // Crear el token JWT
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || 'default_secret', // Usar un valor por defecto si JWT_SECRET no está configurado
        { expiresIn: '1h' }
      );

      if (!token) {
        console.error('No se pudo generar el token JWT.');
        return res.status(500).json({ success: false, message: 'Error al generar el token.' });
      }

      // Establecer la cookie con el token
      res.setHeader('Set-Cookie', cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 3600, // 1 hora
        sameSite: 'strict',
        path: '/',
      }));

      console.log('Login exitoso para el usuario:', email);
      return res.status(200).json({ success: true, message: 'Login exitoso.' });
    } catch (error) {
      console.error('Error en el servidor:', error.message);
      return res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
  } else {
    console.error('Método no permitido:', method);
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Método ${method} no permitido`);
  }
}
