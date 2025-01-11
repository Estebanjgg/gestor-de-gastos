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
        <p>
          Por favor, <a href="/auth/login">inicia sesión</a> para acceder.
        </p>
      </div>
    );
  }

  return (
    <Layout user={user}>
      <div style={styles.container}>
        <h1>Bienvenido, {user.email}</h1>
        <p>Aquí puedes gestionar tus gastos y otros recursos.</p>
        {/* Aquí puedes agregar más contenido como formularios o gráficas */}
      </div>
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

export async function getServerSideProps(context) {
  const { req } = context;

  try {
    // Leer y parsear las cookies del request
    const parsedCookies = cookie.parse(req.headers.cookie || '');
    const token = parsedCookies.token || null;

    // Autenticar al usuario
    const user = authenticate(token);

    if (user) {
      // Conectar a la base de datos
      await dbConnect();

      // Buscar al usuario en la base de datos, excluyendo la contraseña
      const existingUser = await User.findById(user.userId).select('-password').lean();

      if (existingUser) {
        return {
          props: {
            user: { email: existingUser.email },
          },
        };
      }
    }

    // Si no hay token o el usuario no existe, redirigir al login
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  } catch (error) {
    console.error('Error en el servidor:', error);
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }
}
