import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import eyeOpened from '../../assets/icons/eye.svg';
import eyeClosed from '../../assets/icons/eye-blocked.svg';

import styles from './RegistrationForm.module.css';
import { registerUser } from '../../services/authApi';

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, 'Name must be at least 2 characters.')
    .max(40, 'Name must be at most 40 characters.')
    .required('Name is required.'),

  email: Yup.string()
    .email('Please enter a valid email address.')
    .required('Email is required.'),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters.')
    .required('Password is required.'),
});

export default function RegistrationForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (values, actions) => {
    setApiMessage('');
    setIsSuccess(false);

    try {
      const response = await registerUser({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      setApiMessage(
        response.message || 'Registration successful! You can now sign in.'
      );

      setIsSuccess(true);
      actions.resetForm();
    } catch (error) {
      const data = error.response?.data;

      setApiMessage(
        data?.errors?.[0]?.message ||
          data?.message ||
          'Registration failed. Please try again.'
      );

      setIsSuccess(false);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        password: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form
          className={styles.loginForm}
          noValidate
          onChange={() => {
            setApiMessage('');
            setIsSuccess(false);
          }}
        >
          <Field
            className={styles.formInput}
            type="text"
            name="name"
            placeholder="Name *"
            autoComplete="name"
            id="name"
          />

          <ErrorMessage
            name="name"
            component="div"
            className={styles.errorMessage}
          />

          <Field
            className={styles.formInput}
            type="email"
            name="email"
            placeholder="Email *"
            autoComplete="email"
            id="email"
          />

          <ErrorMessage
            name="email"
            component="div"
            className={styles.errorMessage}
          />

          <div className={styles.passwordWrapper}>
            <Field
              className={`${styles.formInput} ${styles.passInput}`}
              type={isPasswordVisible ? 'text' : 'password'}
              name="password"
              placeholder="Password *"
              autoComplete="new-password"
              id="password"
            />

            <button
              className={styles.pswdVisBtn}
              type="button"
              onClick={() => setIsPasswordVisible(visible => !visible)}
              aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            >
              <img
                className={styles.pswdBtnImg}
                src={isPasswordVisible ? eyeOpened : eyeClosed}
                alt=""
              />
            </button>
          </div>

          <ErrorMessage
            name="password"
            component="div"
            className={styles.errorMessage}
          />

          <div className={styles.btnCont}>
            <button
              type="submit"
              className={styles.registerButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </div>

          {apiMessage && (
            <p
              className={
                isSuccess ? styles.successMessage : styles.apiErrorMessage
              }
              role="status"
            >
              {apiMessage}
            </p>
          )}
        </Form>
      )}
    </Formik>
  );
}
