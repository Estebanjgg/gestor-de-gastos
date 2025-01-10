// pages/dashboard.js
import { authenticate } from '../lib/auth';
import dbConnect from '../lib/dbConnect';
import User from '../models/User';
import cookie from 'cookie';
import Layout from '../components/Layout';

export default function Dashboard({ user }) {
  if (!user) {
    return (
      <div style={styles.container}>
        <h1>No estás autorizado para ver esta página.</h1>
      </div>
    );
  }

  return (
    <Layout user={user}>
      <h1>Bienvenido, {user.email}</h1>
      {/* Aquí irá el formulario para gestionar gastos */}
    </Layout>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: 'auto',
    paddingTop: '50px',
    textAlign: 'center',
  },
};

// Función para obtener props del servidor
export async function getServerSideProps(context) {
  const { req } = context;

  // Parsear las cookies usando la librería 'cookie'
  const parsedCookies = cookie.parse(req.headers.cookie || '');
  const token = parsedCookies.token || null;

  const user = authenticate(token);

  if (user) {
    await dbConnect();
    // Buscar el usuario y excluir la contraseña
    const existingUser = await User.findById(user.userId).select('-password').lean();
    if (existingUser) {
      return { props: { user: { email: existingUser.email } } };
    }
  }

  return { props: { user: null } };
}
