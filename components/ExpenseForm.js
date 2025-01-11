// components/ExpenseForm.js
import { useState } from 'react';

export default function ExpenseForm({ onAddExpense }) {
  const [category, setCategory] = useState('MORADIA');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) {
      alert('Por favor, completa todos los campos de gasto.');
      return;
    }

    onAddExpense({ category, title, amount: parseFloat(amount) });
    setTitle('');
    setAmount('');
    setCategory('MORADIA');
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={styles.select}
      >
        <option value="MORADIA">MORADIA</option>
        <option value="ENTRETENIMENTO">ENTRETENIMENTO</option>
        <option value="TRANSPORTE">TRANSPORTE</option>
        <option value="DESPESAS SALUS">DESPESAS SALUS</option>
        <option value="Alimentacion">Alimentacion</option>
        <option value="Educacion">Educacion</option>
        <option value="DISPENSA DIVESAS">DISPENSA DIVESAS</option>
      </select>
      <input
        type="text"
        placeholder="Título del gasto"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
        required
      />
      <input
        type="number"
        placeholder="Monto"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={styles.input}
        min="0"
        step="0.01"
        required
      />
      <button type="submit" style={styles.button}>
        Agregar Gasto
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  select: {
    padding: '10px',
    fontSize: '16px',
    flex: '1 1 200px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    flex: '1 1 200px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
};
