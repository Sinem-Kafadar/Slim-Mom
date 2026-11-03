import DailyCaloriesForm from '../../components/DailyCaloriesForm/DailyCaloriesForm';
import styles from './CalculatorPage.module.css';

function CalculatorPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <DailyCaloriesForm />
      </div>
    </main>
  );
}

export default CalculatorPage;
