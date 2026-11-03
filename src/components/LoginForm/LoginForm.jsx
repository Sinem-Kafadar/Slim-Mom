import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import eyeOpened from '../../assets/icons/eye.svg';
import eyeClosed from '../../assets/icons/eye-blocked.svg';

import { login } from '../../redux/auth/auth-operations';

import styles from './LoginForm.module.css';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address.')
    .required('Email is required.'),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters.')
    .required('Password is required.'),
});

export default function LoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values, actions) => {
    setMessage('');
    setMessageType('info');

    try {
      await dispatch(
        login({
          email: values.email.trim().toLowerCase(),
          password: values.password,
        })
      ).unwrap();

      // Giriş başarılıysa hesaplama sayfasına yönlendir.
      navigate('/calculator');
    } catch (error) {
      const errorMessage =
        typeof error === 'string'
          ? error
          : error.message || 'Login failed. Please try again.';

      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      actions.setSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    setMessage('Password recovery will be available soon.');
    setMessageType('info');
  };

  const handleChange = () => {
    setMessage('');
    setMessageType('info');
  };

  return (
    <Formik
      initialValues={{
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
          autoComplete="off"
          onChange={handleChange}
        >
          <Field
            className={styles.formInput}
            type="email"
            name="email"
            id="email"
            placeholder="Email *"
            autoComplete="off"
          />

          <ErrorMessage
            name="email"
            component="span"
            className={styles.fieldError}
          />

          <div className={styles.passwordWrapper}>
            <Field
              className={`${styles.formInput} ${styles.passwordInput}`}
              type={isPasswordVisible ? 'text' : 'password'}
              name="password"
              id="password"
              placeholder="Password *"
              autoComplete="off"
            />

            <button
              className={styles.passwordToggle}
              type="button"
              onClick={() =>
                setIsPasswordVisible(visible => !visible)
              }
              aria-label={
                isPasswordVisible ? 'Hide password' : 'Show password'
              }
            >
              <img
                src={isPasswordVisible ? eyeOpened : eyeClosed}
                alt=""
                className={styles.passwordIcon}
              />
            </button>
          </div>

          <ErrorMessage
            name="password"
            component="span"
            className={styles.fieldError}
          />

          <div className={styles.authActions}>
            <button
              type="submit"
              className={styles.authActionButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>

            <button
              type="button"
              className={styles.authActionButton}
              onClick={handleForgotPassword}
            >
              Forgot password
            </button>
          </div>

          {message && (
            <p
              className={`${styles.message} ${
                messageType === 'error'
                  ? styles.messageError
                  : styles.messageInfo
              }`}
              role="status"
            >
              {message}
            </p>
          )}
        </Form>
      )}
    </Formik>
  );
}

