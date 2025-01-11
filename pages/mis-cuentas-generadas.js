// pages/mis-cuentas-generadas.js
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import cookie from 'cookie';
import Link from 'next/link';

export default function MisCuentasGeneradas({ user }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchAccounts();
    }
  }, [user]);

  const fetchAccounts = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/cuentas/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (data.success) {
        setAccounts(data.data);
      } else {
        setMessage(data.message || 'Error al obtener las cuentas.');
      }
    } catch (error) {
      console.error('Error al obtener las cuentas:', error);
      setMessage('Error al obtener las cuentas.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <h1 style={styles.header}>No estás autorizado para ver esta página.</h1>
      </div>
    );
  }

  return (
    <div>
      <Navbar user={user} />
      <div style={styles.container}>
        <h1 style={styles.header}>Mis Cuentas Generadas</h1>
        {loading ? (
          <p style={styles.message}>Cargando...</p>
        ) : message ? (
          <p style={styles.message}>{message}</p>
        ) : accounts.length === 0 ? (
          <p style={styles.message}>No has generado ninguna cuenta aún.</p>
        ) : (
          <ul style={styles.list}>
            {accounts.map((account) => (
              <li key={account._id} style={styles.listItem}>
                <div style={styles.listContent}>
                  <h3 style={styles.accountTitle}>{account.title}</h3>
                  <p style={styles.detailText}>
                    <strong style={styles.highlightText}>Monto Total:</strong> ${account.totalAmount.toFixed(2)}
                  </p>
                  <p style={styles.detailText}>
                    <strong style={styles.highlightText}>Diezmo (10%):</strong> ${account.diezmo.toFixed(2)}
                  </p>
                  <p style={styles.detailText}>
                    <strong style={styles.highlightText}>Restante:</strong> ${account.remaining.toFixed(2)}
                  </p>
                </div>
                <div style={styles.actions}>
                  <Link href={`/cuenta/${account._id}`} style={styles.viewButton}>
                    Ver
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
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
  message: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#999',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    marginBottom: '15px',
    padding: '15px',
    borderRadius: '6px',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
  },
  listContent: {
    flex: 1,
    marginRight: '20px',
  },
  accountTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  detailText: {
    fontSize: '16px',
    margin: '5px 0',
    color: '#555',
  },
  highlightText: {
    color: '#008CBA',
    fontWeight: 'bold',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  viewButton: {
    padding: '10px 20px',
    backgroundColor: '#2196F3',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '4px',
    textAlign: 'center',
    fontWeight: 'bold',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
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
