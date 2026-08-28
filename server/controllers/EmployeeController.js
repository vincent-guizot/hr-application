const { Op } = require('sequelize');
const { employee, department, job, dependent } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const include = [{ model: department }, { model: job }, { model: dependent }];

class EmployeeController {
  // GET /employees
  // GET /employees?search=jane   -> partial match on first/last name or email
  // GET /employees?departmentId=1 / ?jobId=2 -> equality filters
  static getAll = asyncHandler(async (req, res) => {
    const { search, ...filters } = req.query;
    const where = {};

    if (search !== undefined) {
      where[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    Object.keys(filters).forEach((key) => {
      if (employee.rawAttributes[key]) {
        where[key] = filters[key];
      }
    });

    const data = await employee.findAll({ where, include });
    res.status(200).json(data);
  });

  // GET /employees/:id
  static getOne = asyncHandler(async (req, res) => {
    const item = await employee.findByPk(req.params.id, { include });
    if (!item) {
      return res.status(404).json({ message: `Employee with id ${req.params.id} not found` });
    }
    res.status(200).json(item);
  });

  // POST /employees (admin only, see routes) - creates an employee record.
  // For self-service signup use POST /auth/register instead.
  static create = asyncHandler(async (req, res) => {
    const { first_name, last_name, email, password, phone_number, hire_date, jobId, salary, role, image, departmentId } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: 'first_name, last_name, email and password are required' });
    }

    const created = await employee.create({
      first_name,
      last_name,
      email,
      password,
      phone_number,
      hire_date,
      jobId,
      salary,
      role,
      image,
      departmentId,
    });

    res.status(201).json(created);
  });

  // PUT /employees/:id
  static update = asyncHandler(async (req, res) => {
    const item = await employee.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: `Employee with id ${req.params.id} not found` });
    }

    // role changes are gated separately at the route level (admin only),
    // but as a defense in depth, non-admins can never smuggle a role change
    // through this endpoint.
    const payload = { ...req.body };
    if (req.user && req.user.role !== 'admin') {
      delete payload.role;
    }

    await item.update(payload);
    res.status(200).json(item);
  });

  // DELETE /employees/:id
  static remove = asyncHandler(async (req, res) => {
    const item = await employee.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: `Employee with id ${req.params.id} not found` });
    }
    await item.destroy();
    res.status(200).json({ message: `Employee with id ${req.params.id} has been deleted` });
  });
}

module.exports = EmployeeController;
