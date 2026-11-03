import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const MainPage = lazy(() => import('../pages/MainPage/MainPage'));

const LoginPage = lazy(() => import('../pages/LoginPage/LoginPage'));

const RegistrationPage = lazy(() =>
  import('../pages/RegistrationPage/RegistrationPage')
);

const CalculatorPage = lazy(() =>
  import('../pages/CalculatorPage/CalculatorPage')
);

const DiaryPage = lazy(() => import('../pages/DiaryPage/DiaryPage'));

const DiaryMobileForm = lazy(() =>
  import('../pages/DiaryMobileForm/DiaryMobileForm')
);

function AppRouter() {
  return (
    <Suspense fallback={<p>Sayfa yükleniyor...</p>}>
      <Routes>
        <Route path="/" element={<MainPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/registration" element={<RegistrationPage />} />

        <Route path="/calculator" element={<CalculatorPage />} />

        <Route path="/diary" element={<DiaryPage />} />

        <Route
          path="/diary-mobile-form"
          element={<DiaryMobileForm />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
