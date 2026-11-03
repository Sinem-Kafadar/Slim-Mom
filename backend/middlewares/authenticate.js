import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check whether the request includes a Bearer token.
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Authentication required.',
    });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      message: 'Access token is missing.',
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      message: 'Server authentication configuration is missing.',
    });
  }

  try {
    // Verify the access token.
    const decoded = jwt.verify(token, secret);

    // Accept only access tokens with a valid user ID.
    if (
      typeof decoded === 'string' ||
      decoded.type !== 'access' ||
      typeof decoded.sub !== 'string'
    ) {
      return res.status(401).json({
        message: 'Invalid access token.',
      });
    }

    // Make the authenticated user's ID available to route handlers.
    req.user = {
      id: decoded.sub,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Access token has expired.',
      });
    }

    return res.status(401).json({
      message: 'Invalid access token.',
    });
  }
};

export default authenticate;
