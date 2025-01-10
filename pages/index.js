// pages/index.js
import cookie from 'cookie';

export default function Home() {
  return null; // Puedes agregar un spinner o indicador de carga aquí si lo prefieres
}

export async function getServerSideProps(context) {
  const { req } = context;

  // Leer las cookies del request
  const parsedCookies = cookie.parse(req.headers.cookie || '');
  const token = parsedCookies.token || null;

  if (token) {
    // Si el token existe, redirigir al dashboard
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  // Si no hay token, redirigir a la página de login
  return {
    redirect: {
      destination: '/auth/login',
      permanent: false,
    },
  };
}
