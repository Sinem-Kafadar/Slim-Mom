import 'dotenv/config';
import dns from 'node:dns';
import mongoose from 'mongoose';
import app from './app.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(
    'MONGODB_URI is missing. Please check the backend/.env file.'
  );

  process.exit(1);
}

try {
  // Connect to MongoDB Atlas
  await mongoose.connect(MONGODB_URI);

  console.log('✅ MongoDB Atlas connection successful!');

  // Start the Express server after the database connection succeeds
  app.listen(PORT, () => {
    console.log(`✅ Slim Mom backend is running at http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('❌ MongoDB connection failed:', error.message);

  process.exit(1);
}
