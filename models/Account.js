// models/Account.js
import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  diezmo: {
    type: Number,
    required: true,
  },
  remaining: {
    type: Number,
    required: true,
  },
  expenses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expense',
    },
  ],
}, { timestamps: true });

export default mongoose.models.Account || mongoose.model('Account', AccountSchema);
