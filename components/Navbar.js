// components/Navbar.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Navbar.module.css';

export default function Navbar({ user }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (data.success) {
        router.push('/auth/login');
      } else {
        alert('Error al cerrar sesión.');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Error al cerrar sesión.');
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <Link href="/dashboard" className={styles.link}>
          Dashboard
        </Link>
        <Link href="/expenses" className={styles.link}>
          Gastos
        </Link>
      </div>
      <div className={styles.navRight}>
        {user ? ( // Validación de que user está definido
          <>
            <span className={styles.userEmail}>Bienvenido, {user.email}</span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Cerrar Sesión
            </button>
          </>
        ) : (
          <p className={styles.userEmail}>Cargando usuario...</p>
        )}
      </div>
    </nav>
  );
}
