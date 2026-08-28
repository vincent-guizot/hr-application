const jwt = require('jsonwebtoken');
const { employee } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

function signToken(emp) {
  return jwt.sign(
    { id: emp.id, email: emp.email, role: emp.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

class AuthController {
  // POST /auth/register
  // Public self-registration. Always creates a plain 'employee' role
  // account, regardless of what the client sends, so nobody can register
  // themselves in as 'admin'. Promote to admin via PUT /employees/:id
  // (admin-only route) instead.
  static register = asyncHandler(async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: 'first_name, last_name, email and password are required' });
    }

    const existing = await employee.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const created = await employee.create({
      first_name,
      last_name,
      email,
      password,
      role: 'employee',
    });

    const token = signToken(created);
    res.status(201).json({ employee: created, token });
  });

  // POST /auth/login
  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    // withPassword scope needed here since the default scope hides it.
    const found = await employee.scope('withPassword').findOne({ where: { email } });
    if (!found) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const valid = await found.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(found);
    res.status(200).json({ employee: found, token });
  });

  // GET /auth/me (requires verifyToken middleware)
  static me = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
  });
}

module.exports = AuthController;
