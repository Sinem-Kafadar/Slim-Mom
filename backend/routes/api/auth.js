import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import User from '../../models/user.js';
import Session from '../../models/session.js';
import validateBody from '../../middlewares/validateBody.js';
import authenticate from '../../middlewares/authenticate.js';
import createTokens from '../../helpers/createTokens.js';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
} from '../../schemas/user.js';

const router = Router();

/**
 * POST /register
 * Register a new user.
 */
router.post(
  '/register',
  validateBody(registerSchema),
  async (req, res) => {
    let createdUserId;

    try {
      const { name, password } = req.body;
      const email = req.body.email.trim().toLowerCase();

      // Check whether the email address is already registered.
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({
          message: 'An account with this email already exists.',
        });
      }

      // Never store the original password.
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      createdUserId = user._id;

      // Create access and refresh tokens.
      const tokens = await createTokens(user._id);

      return res.status(201).json({
        message: 'Registration successful.',
        user,
        ...tokens,
      });
    } catch (error) {
      // Handle a duplicate email caused by simultaneous requests.
      if (error.code === 11000) {
        return res.status(409).json({
          message: 'An account with this email already exists.',
        });
      }

      // Avoid leaving an account behind if token creation fails.
      if (createdUserId) {
        await User.findByIdAndDelete(createdUserId).catch(() => {});
      }

      console.error('Registration error:', error.message);

      return res.status(500).json({
        message: 'Unable to register user.',
      });
    }
  }
);

/**
 * POST /login
 * Authenticate an existing user.
 */
router.post(
  '/login',
  validateBody(loginSchema),
  async (req, res) => {
    try {
      const email = req.body.email.trim().toLowerCase();
      const { password } = req.body;

      const user = await User.findOne({ email });

      // Use the same response for an unknown email and a wrong password.
      if (!user) {
        return res.status(401).json({
          message: 'Invalid email or password.',
        });
      }

      const passwordMatches = await bcrypt.compare(
        password,
        user.password
      );

      if (!passwordMatches) {
        return res.status(401).json({
          message: 'Invalid email or password.',
        });
      }

      const tokens = await createTokens(user._id);

      return res.status(200).json({
        message: 'Login successful.',
        user,
        ...tokens,
      });
    } catch (error) {
      console.error('Login error:', error.message);

      return res.status(500).json({
        message: 'Unable to log in.',
      });
    }
  }
);

/**
 * POST /refresh
 * Exchange a valid refresh token for new tokens.
 */
router.post(
  '/refresh',
  validateBody(refreshSchema),
  async (req, res) => {
    try {
      const refreshSecret = process.env.JWT_REFRESH_SECRET;

      if (!refreshSecret) {
        console.error('JWT_REFRESH_SECRET is missing.');

        return res.status(500).json({
          message: 'Server authentication configuration is missing.',
        });
      }

      const { refreshToken } = req.body;

      let decoded;

      try {
        decoded = jwt.verify(refreshToken, refreshSecret);
      } catch {
        return res.status(401).json({
          message: 'Invalid or expired refresh token.',
        });
      }

      if (
        typeof decoded === 'string' ||
        decoded.type !== 'refresh' ||
        typeof decoded.sub !== 'string'
      ) {
        return res.status(401).json({
          message: 'Invalid refresh token.',
        });
      }

      // Find the corresponding stored session using the token hash.
      const refreshTokenHash = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');

      const session = await Session.findOne({
        userId: decoded.sub,
        refreshTokenHash,
        expiresAt: { $gt: new Date() },
      });

      if (!session) {
        return res.status(401).json({
          message: 'Refresh session is invalid or expired.',
        });
      }

      const user = await User.findById(decoded.sub);

      if (!user) {
        await Session.deleteOne({ _id: session._id });

        return res.status(401).json({
          message: 'User account no longer exists.',
        });
      }

      // Create the replacement session before removing the old one.
      const tokens = await createTokens(user._id);

      await Session.deleteOne({ _id: session._id });

      return res.status(200).json({
        message: 'Token refresh successful.',
        user,
        ...tokens,
      });
    } catch (error) {
      console.error('Refresh token error:', error.message);

      return res.status(500).json({
        message: 'Unable to refresh session.',
      });
    }
  }
);

/**
 * POST /logout
 * Revoke the session associated with the supplied refresh token.
 */
router.post(
  '/logout',
  validateBody(refreshSchema),
  async (req, res) => {
    try {
      const { refreshToken } = req.body;

      const refreshTokenHash = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');

      await Session.deleteOne({ refreshTokenHash });

      return res.status(200).json({
        message: 'Logout successful.',
      });
    } catch (error) {
      console.error('Logout error:', error.message);

      return res.status(500).json({
        message: 'Unable to log out.',
      });
    }
  }
);

/**
 * GET /me
 * Return the authenticated user's information.
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error('Get current user error:', error.message);

    return res.status(500).json({
      message: 'Unable to retrieve user information.',
    });
  }
});

export default router;
