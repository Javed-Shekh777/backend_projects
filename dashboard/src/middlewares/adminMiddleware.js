const databaseAccessMiddleware = (req, res, next) => {
    const { role } = req.user;
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can perform this action.' });
    }
    next();
  };
  