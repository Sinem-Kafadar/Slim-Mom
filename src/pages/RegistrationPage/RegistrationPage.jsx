import RegistrationForm from '../../components/RegistrationForm/RegistrationForm';
import styles from './RegistrationPage.module.css';

function RegistrationPage() {
  return (
    <main className={styles.page}>
      <section className={styles.content}>
        <h1 className={styles.title}>Register</h1>

        <RegistrationForm />
      </section>
    </main>
  );
}

export default RegistrationPage;
