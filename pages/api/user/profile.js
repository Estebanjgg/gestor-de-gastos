// pages/api/user/profile.js
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import { authenticate } from '../../../lib/auth';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Método ${req.method} no permitido`);
  }

  await dbConnect();

  const parsedCookies = cookie.parse(req.headers.cookie || '');
  const token = parsedCookies.token || null;
  const user = authenticate(token);

  if (!user) {
    return res.status(401).json({ success: false, message: 'No autorizado' });
  }

  try {
    const existingUser = await User.findById(user.userId).select('-password').lean();
    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.status(200).json({ success: true, data: existingUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
}
