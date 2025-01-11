// pages/api/cuentas/list.js
import dbConnect from '../../../lib/dbConnect';
import { authenticate } from '../../../lib/auth';
import Account from '../../../models/Account';
import Expense from '../../../models/Expense';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Método ${req.method} no permitido`);
  }

  await dbConnect();

  // Parsear las cookies para obtener el token
  const parsedCookies = cookie.parse(req.headers.cookie || '');
  const token = parsedCookies.token || null;
  const user = authenticate(token);

  if (!user) {
    return res.status(401).json({ success: false, message: 'No autorizado' });
  }

  try {
    const accounts = await Account.find({ user: user.userId })
      .populate('expenses')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: accounts });
  } catch (error) {
    console.error('Error al obtener las cuentas:', error);
    res.status(500).json({ success: false, message: 'Error del servidor.' });
  }
}
