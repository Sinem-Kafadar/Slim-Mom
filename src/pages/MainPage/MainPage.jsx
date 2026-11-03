import styles from './MainPage.module.css';

import Container from '../../components/Container/Container';
import DailyCaloriesForm from '../../components/DailyCaloriesForm/DailyCaloriesForm';

function MainPage() {
  return (
    <main>
      <section className={styles.section}>
        <Container>
          <DailyCaloriesForm />
        </Container>
      </section>
    </main>
  );
}

export default MainPage;
