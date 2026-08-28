function notFound(req, res, next) {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
}

// Centralized error handler so controllers can just `next(e)` (or throw
// inside an async wrapper) instead of every controller duplicating the
// same Sequelize error translation logic.
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors.map((e) => e.message),
    });
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      message: 'Invalid reference: related record does not exist, or it is still referenced by other records',
    });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal server error' });
}

module.exports = { notFound, errorHandler };
