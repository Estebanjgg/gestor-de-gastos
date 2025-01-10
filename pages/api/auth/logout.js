// pages/api/auth/logout.js
import cookie from 'cookie';

export default function handler(req, res) {
  if (req.method === 'POST') {
    res.setHeader('Set-Cookie', cookie.serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(0), // Fecha pasada para eliminar la cookie
      sameSite: 'strict',
      path: '/',
    }));

    res.status(200).json({ success: true, message: 'Logout exitoso.' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
