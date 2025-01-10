// pages/gastos.js
import { authenticate } from '../lib/auth';
import dbConnect from '../lib/dbConnect';
import User from '../models/User';
import cookie from 'cookie';
import Navbar from '../components/Navbar';

export default function Gastos({ user }) {
  if (!user) {
    return (
      <div style={styles.container}>
        <h1>No estás autorizado para ver esta página.</h1>
      </div>
    );
  }

  return (
    <div>
      <Navbar user={user} />
      <div style={styles.content}>
        <h1>Gestión de Gastos</h1>
        {/* Aquí irá el formulario y la lista de gastos */}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: 'auto',
    paddingTop: '50px',
    textAlign: 'center',
  },
  content: {
    maxWidth: '800px',
    margin: 'auto',
    paddingTop: '20px',
    textAlign: 'center',
  },
};

export async function getServerSideProps(context) {
  const { req } = context;

  // Parsear las cookies usando la librería 'cookie'
  const parsedCookies = cookie.parse(req.headers.cookie || '');
  const token = parsedCookies.token || null;

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
