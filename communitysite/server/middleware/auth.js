const { getAuth } = require('@clerk/backend');

/**
 * Middleware to verify Clerk authentication
 */
const requireAuth = async (req, res, next) => {
  try {
    const auth = getAuth(req);

    if (!auth.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'UNAUTHORIZED'
      });
    }

    // Add user info to request object
    req.auth = auth;
    req.userId = auth.userId;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token',
      error: 'INVALID_TOKEN'
    });
  }
};

/**
 * Optional authentication middleware - doesn't fail if no auth
 */
const optionalAuth = async (req, res, next) => {
  try {
    const auth = getAuth(req);

    if (auth.userId) {
      req.auth = auth;
      req.userId = auth.userId;
    }

    next();
  } catch (error) {
    // Continue without auth if token is invalid
    next();
  }
};

/**
 * Middleware to get user info from Clerk
 */
const getUserInfo = async (req, res, next) => {
  try {
    if (!req.userId) {
      return next();
    }

    const { clerkClient } = require('@clerk/backend');
    const user = await clerkClient.users.getUser(req.userId);

    req.user = {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      imageUrl: user.imageUrl,
      username: user.username || user.emailAddresses[0]?.emailAddress?.split('@')[0],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    next();
  } catch (error) {
    console.error('Get user info error:', error);
    next(); // Continue without user info
  }
};

module.exports = {
  requireAuth,
  optionalAuth,
  getUserInfo
};