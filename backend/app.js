import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRouter from './routes/api/auth.js';
import productsRouter from './routes/api/products.js';
import dailyNutritionsRouter from './routes/api/dailyNutritions.js';
import dailyIntakeRouter from './routes/api/dailyIntakeRoutes.js';

const app = express();

// Frontend ile backend arasındaki bağlantı
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// Gelen isteklerin gövdelerini okumak için
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie bilgilerini okuyabilmek için
app.use(cookieParser());

// Gelen HTTP isteklerini geliştirme ortamında kaydet
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Backend'in çalışıp çalışmadığını kontrol etmek için
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Slim Mom API is running.',
  });
});

// Authentication routes
app.use('/api/auth', authRouter);

// Product routes
app.use('/api/products', productsRouter);

// Daily Nutrition routes
app.use('/api/dailynutritions', dailyNutritionsRouter);

app.use('/api/daily-intake', dailyIntakeRouter);

// Bulunamayan adresler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found.',
    path: req.originalUrl,
  });
});

// Genel hata yönetimi
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || error.status || 500;

  res.status(statusCode).json({
    message: statusCode >= 500 ? 'Internal server error.' : error.message,
    path: req.originalUrl,
  });
});

export default app;
