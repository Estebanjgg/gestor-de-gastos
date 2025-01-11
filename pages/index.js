import cookie from 'cookie';
import { authenticate } from '../lib/auth';

export async function getServerSideProps(context) {
  const { req } = context;

  try {
    // Validar si req y req.headers existen antes de intentar leer cookies
    if (!req || !req.headers || !req.headers.cookie) {
      console.warn('No hay cookies disponibles en la solicitud.');
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false,
        },
      };
    }

    // Parsear las cookies del request
    const parsedCookies = cookie.parse(req.headers.cookie || '');
    const token = parsedCookies.token || null;

    // Autenticar al usuario con el token
    const user = authenticate(token);

    if (user) {
      // Si el token es válido, redirigir al dashboard
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      };
    }

    // Redirigir al login si no hay token
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  } catch (error) {
    console.error('Error al procesar las cookies:', error);
    return {
      notFound: true,
    };
  }
}

export default function Home() {
  return null; // La página no tiene contenido ya que siempre redirige
}
