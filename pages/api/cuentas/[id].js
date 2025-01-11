// pages/api/cuentas/[id].js
import dbConnect from '../../../lib/dbConnect';
import Account from '../../../models/Account';
import Expense from '../../../models/Expense';
import { authenticate } from '../../../lib/auth';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'ID inválido' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  const user = authenticate(token);

  if (!user) {
    return res.status(401).json({ success: false, message: 'No autorizado' });
  }

  if (method === 'PUT') {
    try {
      const account = await Account.findById(id);

      if (!account) {
        return res.status(404).json({ success: false, message: 'Cuenta no encontrada' });
      }

      if (account.user.toString() !== user.userId) {
        return res.status(403).json({ success: false, message: 'No tienes permiso para editar esta cuenta' });
      }

      const { title, totalAmount, expenses } = req.body;

      account.title = title || account.title;
      account.totalAmount = totalAmount || account.totalAmount;
      account.diezmo = account.totalAmount * 0.1;
      account.remaining = account.totalAmount - account.diezmo;

      if (expenses && Array.isArray(expenses)) {
        await Expense.deleteMany({ _id: { $in: account.expenses } });

        const newExpenses = await Expense.insertMany(
          expenses.map((expense) => ({
            ...expense,
            user: account.user,
            account: account._id,
          }))
        );

        account.expenses = newExpenses.map((expense) => expense._id);
      }

      await account.save();

      return res.status(200).json({ success: true, message: 'Cuenta actualizada exitosamente', data: account });
    } catch (error) {
      console.error('Error al actualizar la cuenta:', error);
      return res.status(500).json({ success: false, message: 'Error del servidor' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Método ${method} no permitido`);
  }
}
