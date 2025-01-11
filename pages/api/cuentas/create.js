// pages/api/cuentas/create.js
import dbConnect from '../../../lib/dbConnect';
import { authenticate } from '../../../lib/auth';
import Account from '../../../models/Account';
import Expense from '../../../models/Expense';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
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

  const { title, totalAmount, expenses } = req.body;

  if (!title || !totalAmount) {
    return res.status(400).json({ success: false, message: 'Título y monto total son requeridos.' });
  }

  try {
    // Calcular diezmo y restante
    const diezmo = totalAmount * 0.10;
    const remaining = totalAmount - diezmo;

    // Crear la cuenta
    const account = await Account.create({
      user: user.userId,
      title,
      totalAmount,
      diezmo,
      remaining,
      expenses: [],
    });

    // Crear gastos asociados
    if (expenses && Array.isArray(expenses)) {
      for (const exp of expenses) {
        const { category, title, amount } = exp;
        const expense = await Expense.create({
          user: user.userId,
          account: account._id,
          category,
          title,
          amount,
        });
        account.expenses.push(expense._id);
      }
      // Recalcular el total de gastos
      const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
      account.remaining -= totalExpenses;
      await account.save();
    }

    res.status(201).json({ success: true, data: account });
  } catch (error) {
    console.error('Error al crear la cuenta:', error);
    res.status(500).json({ success: false, message: 'Error del servidor.' });
  }
}
