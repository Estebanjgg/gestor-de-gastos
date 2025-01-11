// pages/cuenta/[id].js
import Navbar from '../../components/Navbar';
import cookie from 'cookie';
import mongoose from 'mongoose';

export default function CuentaDetalles({ user, account, message }) {
  if (!user) {
    return (
      <div style={styles.container}>
        <h1 style={styles.header}>No estás autorizado para ver esta página.</h1>
      </div>
    );
  }

  if (message) {
    return (
      <div>
        <Navbar user={user} />
        <div style={styles.container}>
          <p style={styles.noExpenses}>{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar user={user} />
      <div style={styles.container}>
        <h1 style={styles.header}>{account.title}</h1>
        <div style={styles.section}>
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
        <div style={styles.section}>
          <h2 style={styles.header}>Gastos</h2>
          {account.expenses.length === 0 ? (
            <p style={styles.noExpenses}>No hay gastos agregados.</p>
          ) : (
            <ul style={styles.expenseList}>
              {account.expenses.map((expense) => (
                <li key={expense._id} style={styles.expenseItem}>
                  <span style={styles.expenseCategory}>{expense.category}:</span>
                  <span style={styles.expenseTitle}>{expense.title}</span>
                  <span style={styles.expenseAmount}>${expense.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
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
  section: {
    marginBottom: '20px',
  },
  detailText: {
    fontSize: '18px',
    margin: '5px 0',
    color: '#555',
  },
  highlightText: {
    color: '#008CBA',
    fontWeight: 'bold',
  },
  expenseList: {
    listStyleType: 'none',
    padding: 0,
  },
  expenseItem: {
    backgroundColor: '#f9f9f9',
    marginBottom: '10px',
    padding: '15px',
    borderRadius: '6px',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseCategory: {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#555',
  },
  expenseTitle: {
    fontSize: '16px',
    color: '#333',
  },
  expenseAmount: {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#008CBA',
  },
  noExpenses: {
    textAlign: 'center',
    color: '#999',
    fontSize: '16px',
    marginTop: '10px',
  },
};

export async function getServerSideProps(context) {
  const { req, params } = context;
  const { id } = params;

  console.log('ID recibido:', id);

  const parsedCookies = cookie.parse(req.headers.cookie || '');
  const token = parsedCookies.token || null;

  console.log('Token recibido:', token);

  const { authenticate } = await import('../../lib/auth');
  const dbConnect = (await import('../../lib/dbConnect')).default;
  const User = (await import('../../models/User')).default;
  const Account = (await import('../../models/Account')).default;

  const user = authenticate(token);

  if (!user) {
    console.log('Usuario no autenticado');
    return { props: { user: null } };
  }

  console.log('Usuario autenticado:', user);

  try {
    await dbConnect();
    console.log('Conexión a la base de datos exitosa');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    return { props: { user: { email: user.email }, message: 'Error al conectar con la base de datos' } };
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log('ID inválido');
    return { props: { user: { email: user.email }, message: 'ID inválido' } };
  }

  let account;
  try {
    account = await Account.findById(id).populate('expenses').lean();
    console.log('Cuenta encontrada:', account);
  } catch (error) {
    console.error('Error al buscar la cuenta:', error);
    return { props: { user: { email: user.email }, message: 'Error al buscar la cuenta' } };
  }

  if (!account || account.user.toString() !== user.userId) {
    console.log('Cuenta no encontrada o no pertenece al usuario');
    return { props: { user: { email: user.email }, message: 'Cuenta no encontrada.' } };
  }

  try {
    // Serialización de datos
    account._id = account._id.toString();
    account.user = account.user.toString();
    account.createdAt = account.createdAt.toISOString();
    account.updatedAt = account.updatedAt.toISOString();
    account.expenses = account.expenses.map((expense) => ({
      ...expense,
      _id: expense._id.toString(),
      user: expense.user?.toString() || null,
      account: expense.account?.toString() || null,
      createdAt: expense.createdAt.toISOString(),
      updatedAt: expense.updatedAt.toISOString(),
    }));
    console.log('Datos serializados correctamente');
  } catch (error) {
    console.error('Error al serializar los datos:', error);
    return { props: { user: { email: user.email }, message: 'Error al serializar los datos' } };
  }

  return { props: { user: { email: user.email }, account } };
}
