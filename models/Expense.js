// models/Expense.js
import mongoose from 'mongoose';

const GastoSchema = new mongoose.Schema({
  descripcion: { type: String, required: true },
  categoria: {
    type: String,
    required: true,
    enum: ['MORADIA', 'ENTRETENIMIENTO', 'TRANSPORTE', 'ALIMENTACION', 'EDUCACION', 'SALUD'],
  },
  monto: { type: Number, required: true },
});

const ExpenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  bruto: { type: Number, required: true },
  diezmo: { type: Number, required: true },
  saldo: { type: Number, required: true },
  gastos: { type: [GastoSchema], required: true }, // Lista de gastos
  month: { type: Number, required: true }, // Mes de la cuenta
  year: { type: Number, required: true }, // Año de la cuenta
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
