import LoginForm from '../../components/LoginForm/LoginForm';
import styles from './LoginPage.module.css';

function LoginPage() {
  return (
    <main className={styles.page}>
      <section className={styles.content}>
        <h1 className={styles.title}>Sign In</h1>

        <LoginForm />
      </section>
    </main>
  );
}

export default LoginPage;
