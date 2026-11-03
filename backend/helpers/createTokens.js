import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import Session from '../models/session.js';

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '30d';

const REFRESH_TOKEN_EXPIRES_IN_MS =
  30 * 24 * 60 * 60 * 1000;

const createTokens = async (userId) => {
  const accessSecret = process.env.JWT_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!accessSecret) {
    throw new Error('JWT_SECRET is missing in backend/.env');
  }

  if (!refreshSecret) {
    throw new Error('JWT_REFRESH_SECRET is missing in backend/.env');
  }

  const userIdString = String(userId);

  // Create a short-lived access token.
  const accessToken = jwt.sign(
    {
      sub: userIdString,
      type: 'access',
    },
    accessSecret,
    {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    }
  );

  // Create a refresh token with a unique identifier.
  const refreshToken = jwt.sign(
    {
      sub: userIdString,
      type: 'refresh',
      jti: crypto.randomUUID(),
    },
    refreshSecret,
    {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    }
  );

  // Hash the refresh token before storing it in MongoDB.
  const refreshTokenHash = crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('hex');

  // Save the user's session in MongoDB Atlas.
  await Session.create({
    userId,
    refreshTokenHash,
    expiresAt: new Date(
      Date.now() + REFRESH_TOKEN_EXPIRES_IN_MS
    ),
  });

  return {
    accessToken,
    refreshToken,
  };
};

export default createTokens;
