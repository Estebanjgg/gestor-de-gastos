// pages/auth/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      setMessage('Login exitoso. Redirigiendo...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } else {
      setMessage(data.message || 'Error en el login.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <div style={styles.passwordWrapper}>
          <input
            type={showPassword ? 'text' : 'password'} // Alterna entre texto y contraseña
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)} // Alterna el estado
            style={styles.toggleButton}
          >
            {showPassword ? '🙈' : '👁️'} {/* Cambia el icono */}
          </button>
        </div>
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>
      </form>
      {message && <p>{message}</p>}
      <p>
        ¿No tienes una cuenta? <a href="/auth/register">Regístrate</a>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: 'auto',
    paddingTop: '100px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  passwordWrapper: {
    position: 'relative',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box',
  },
  toggleButton: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};
