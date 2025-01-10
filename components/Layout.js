// components/Layout.js
import Navbar from './Navbar';

export default function Layout({ children, user }) {
  return (
    <div>
      <Navbar user={user} />
      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
}

const styles = {
  main: {
    padding: '20px',
    maxWidth: '800px',
    margin: 'auto',
  },
};
