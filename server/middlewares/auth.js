const jwt = require('jsonwebtoken');
const { employee } = require('../models');

// Verifies the Bearer token, loads the employee, and attaches it to req.user.
// Any route using this must be called after express.json().
async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await employee.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Employee for this token no longer exists' });
    }

    req.user = user;
    next();
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please log in again' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Usage: authorizeRoles('admin') or authorizeRoles('admin', 'employee')
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
    next();
  };
}

module.exports = { verifyToken, authorizeRoles };
