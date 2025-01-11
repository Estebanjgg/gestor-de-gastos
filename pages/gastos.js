// pages/gastos.js
import { useState } from 'react';
import Navbar from '../components/Navbar';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import cookie from 'cookie';

export default function Gastos({ user }) {
  const [accountTitle, setAccountTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAddExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  const handleRemoveExpense = (index) => {
    const newExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(newExpenses);
  };

  const handleSaveAccount = async () => {
    if (!accountTitle || !totalAmount) {
      alert('Por favor, completa el título de la cuenta y el monto total.');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/cuentas/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: accountTitle,
          totalAmount: parseFloat(totalAmount),
          expenses,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('Cuenta guardada exitosamente.');
        setAccountTitle('');
        setTotalAmount('');
        setExpenses([]);
      } else {
        setMessage(data.message || 'Error al guardar la cuenta.');
      }
    } catch (error) {
      console.error('Error al guardar la cuenta:', error);
      setMessage('Error al guardar la cuenta.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Navbar user={user} />
      <div style={styles.container}>
        <h1 style={styles.header}>Registrar Gastos</h1>
        <div style={styles.section}>
          <h2 style={styles.subHeader}>Datos de la Cuenta</h2>
          <input
            type="text"
            placeholder="Título de la cuenta"
            value={accountTitle}
            onChange={(e) => setAccountTitle(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="number"
            placeholder="Monto Total"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            style={styles.input}
            min="0"
            step="0.01"
            required
          />
          {totalAmount && (
            <div style={styles.calculations}>
              <p style={styles.calculationText}>
                <strong style={styles.highlightText}>Diezmo (10%):</strong> ${(
                  parseFloat(totalAmount) * 0.1
                ).toFixed(2)}
              </p>
              <p style={styles.calculationText}>
                <strong style={styles.highlightText}>Restante para gastos:</strong> ${(
                  parseFloat(totalAmount) * 0.9
                ).toFixed(2)}
              </p>
            </div>
          )}
        </div>

        <div style={styles.section}>
          <h2 style={styles.subHeader}>Agregar Gastos</h2>
          <ExpenseForm onAddExpense={handleAddExpense} />
          <ExpenseList expenses={expenses} onRemoveExpense={handleRemoveExpense} />
        </div>

        <button onClick={handleSaveAccount} style={styles.saveButton} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar Cuenta'}
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: 'auto',
    padding: '20px',
    backgroundColor: '#fefefe',
    borderRadius: '8px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
  },
  subHeader: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  section: {
    marginBottom: '30px',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  calculations: {
    backgroundColor: '#e8f5e9',
    padding: '10px',
    borderRadius: '4px',
    marginTop: '10px',
  },
  calculationText: {
    margin: '5px 0',
    fontSize: '16px',
    color: '#333',
  },
  highlightText: {
    color: '#388E3C',
    fontWeight: 'bold',
  },
  saveButton: {
    padding: '15px 30px',
    fontSize: '18px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  message: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '16px',
    color: '#d32f2f',
  },
};

export async function getServerSideProps(context) {
  const { req } = context;

  const parsedCookies = cookie.parse(req.headers.cookie || '');
  const token = parsedCookies.token || null;

  const { authenticate } = await import('../lib/auth');
  const dbConnect = (await import('../lib/dbConnect')).default;
  const User = (await import('../models/User')).default;

  const user = authenticate(token);

  if (user) {
    await dbConnect();
    const existingUser = await User.findById(user.userId).lean();
    if (existingUser) {
      return { props: { user: { email: existingUser.email } } };
    }
  }

  return { props: { user: null } };
}
