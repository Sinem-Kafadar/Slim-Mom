import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import validationSchema from '../../Validator/calcValidation';

import {
  calculateDailyIntake,
  saveUserDailyIntake,
} from '../../redux/auth/auth-operations.js';

import {
  selectIsLoggedIn,
  selectDailyIntakeLoading,
} from '../../redux/auth/auth-selector.js';

import Modal from '../Modal/Modal';
import styles from './DailyCaloriesForm.module.css';

const initialValues = {
  height: '',
  age: '',
  currentWeight: '',
  desiredWeight: '',
  bloodType: '',
};

export default function DailyCaloriesForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux kullanıcı bilgileri
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isLoading = useSelector(selectDailyIntakeLoading);

  // Form verileri
  const [formData, setFormData] = useState(initialValues);

  const [error, setError] = useState('');
  const [calorieResult, setCalorieResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form alanlarını güncelle
  const handleInputChange = event => {
    const { name, value } = event.target;

    setFormData(previousValues => ({
      ...previousValues,
      [name]: value,
    }));

    setError('');
    setCalorieResult(null);
    setIsModalOpen(false);
  };

  // Kalori hesaplama
  const handleSubmit = async event => {
    event.preventDefault();

    setError('');
    setIsModalOpen(false);
    setCalorieResult(null);

    try {
      // Form doğrulaması
      const validatedValues = await validationSchema.validate(formData, {
        abortEarly: false,
      });

      // Backend'e sayısal değerler gönder
      const personalData = {
        height: Number(validatedValues.height),
        age: Number(validatedValues.age),
        currentWeight: Number(validatedValues.currentWeight),
        desiredWeight: Number(validatedValues.desiredWeight),
        bloodType: Number(validatedValues.bloodType),
      };

      let result;

      // Kullanıcının giriş durumuna göre doğru işlemi çalıştır
      if (isLoggedIn) {
        // Giriş yapan kullanıcı: hesapla ve MongoDB'ye kaydet
        result = await dispatch(saveUserDailyIntake(personalData)).unwrap();
      } else {
        // Giriş yapmayan kullanıcı: yalnızca hesapla
        result = await dispatch(calculateDailyIntake(personalData)).unwrap();
      }

      // Backend yanıtını kontrol et
      if (!result || !Number.isFinite(Number(result.calories))) {
        setError('Unable to calculate daily calorie intake.');
        return;
      }

      // Sonucu modalda göster
      setCalorieResult(result);
      setIsModalOpen(true);
    } catch (validationError) {
      setError(
        typeof validationError === 'string'
          ? validationError
          : validationError.errors?.[0] ||
              'Please check your information and try again.'
      );
    }
  };

  // Modalı kapat
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Diary veya Registration sayfasına geç
  const handleStartLosingWeight = () => {
    setIsModalOpen(false);

    navigate(isLoggedIn ? '/diary' : '/registration');
  };

  return (
    <>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>
          Calculate your daily calorie intake right now
        </h2>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.labelContainer}>
            <label className={styles.label} htmlFor="height">
              <input
                className={styles.input}
                id="height"
                type="number"
                name="height"
                min="100"
                max="300"
                value={formData.height}
                onChange={handleInputChange}
                placeholder="Height *"
                required
              />
            </label>

            <label className={styles.label} htmlFor="age">
              <input
                className={styles.input}
                id="age"
                type="number"
                name="age"
                min="6"
                max="130"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Age *"
                required
              />
            </label>

            <label className={styles.label} htmlFor="currentWeight">
              <input
                className={styles.input}
                id="currentWeight"
                type="number"
                name="currentWeight"
                min="40"
                max="270"
                value={formData.currentWeight}
                onChange={handleInputChange}
                placeholder="Current weight *"
                required
              />
            </label>

            <label className={styles.label} htmlFor="desiredWeight">
              <input
                className={styles.input}
                id="desiredWeight"
                type="number"
                name="desiredWeight"
                min="40"
                max="270"
                value={formData.desiredWeight}
                onChange={handleInputChange}
                placeholder="Desired weight *"
                required
              />
            </label>

            <p className={styles.textBloodType}>Blood type *</p>

            <div className={styles.bloodTypes}>
              {[1, 2, 3, 4].map(type => (
                <label className={styles.labelRadio} key={type}>
                  <input
                    className={styles.inputRadio}
                    type="radio"
                    name="bloodType"
                    value={String(type)}
                    checked={formData.bloodType === String(type)}
                    onChange={handleInputChange}
                  />

                  <span className={styles.numbers}>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <p className={styles.formError} role="alert">
              {error}
            </p>
          )}

          <div className={styles.buttonPosition}>
            <button
              className={styles.submitButton}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Calculating...' : 'Start losing weight'}
            </button>
          </div>
        </form>
      </div>

      {/* Kalori sonuç modalı */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className={styles.modalContent}>
          <h2 className={styles.modalTitle}>
            Your recommended daily calorie intake is
          </h2>

          <p className={styles.modalCalories}>
            {calorieResult?.calories}
            <span> kcal / day</span>
          </p>

          <h3 className={styles.modalSubtitle}>Foods you should not eat</h3>

          {calorieResult?.notAllowedProduct?.length > 0 ? (
            <ul className={styles.notAllowedList}>
              {calorieResult.notAllowedProduct.map((product, index) => (
                <li
                  className={styles.notAllowedItem}
                  key={product._id || `${product.title}-${index}`}
                >
                  {product.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.modalInfo}>No restricted products found.</p>
          )}

          <button
            className={styles.modalButton}
            type="button"
            onClick={handleStartLosingWeight}
          >
            Start losing weight
          </button>
        </div>
      </Modal>
    </>
  );
}
