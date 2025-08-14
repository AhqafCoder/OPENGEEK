const adminOnly = (req, res, next) => {
  // Check if user has admin role
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admins only.'
    });
  }
};

module.exports = adminOnly;
