const { Op } = require('sequelize');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Builds a standard set of CRUD handlers (getAll, getOne, create, update,
 * remove) for a Sequelize model, so simple resources (region, country,
 * location, department, job, dependent) don't need near-identical
 * controllers hand-written and re-hand-written for each one.
 *
 * @param {import('sequelize').Model} model
 * @param {Object} options
 * @param {string} [options.searchField='name'] - field used for ?search=
 * @param {Array}  [options.include] - associations to eager-load
 * @param {string} [options.notFoundLabel] - label used in 404 messages
 */
function crudFactory(model, options = {}) {
  const searchField = options.searchField || 'name';
  const include = options.include || [];
  const label = options.notFoundLabel || model.name;

  return {
    // GET /resource            -> list all
    // GET /resource?search=xx  -> partial match on searchField
    // GET /resource?someFk=1   -> equality filter on any real column (e.g. regionId)
    getAll: asyncHandler(async (req, res) => {
      const { search, ...filters } = req.query;
      const where = {};

      if (search !== undefined) {
        where[searchField] = { [Op.iLike]: `%${search}%` };
      }

      Object.keys(filters).forEach((key) => {
        if (model.rawAttributes[key]) {
          where[key] = filters[key];
        }
      });

      const data = await model.findAll({ where, include });
      res.status(200).json(data);
    }),

    // GET /resource/:id
    getOne: asyncHandler(async (req, res) => {
      const item = await model.findByPk(req.params.id, { include });
      if (!item) {
        return res.status(404).json({ message: `${label} with id ${req.params.id} not found` });
      }
      res.status(200).json(item);
    }),

    // POST /resource
    create: asyncHandler(async (req, res) => {
      const item = await model.create(req.body);
      res.status(201).json(item);
    }),

    // PUT /resource/:id
    update: asyncHandler(async (req, res) => {
      const item = await model.findByPk(req.params.id);
      if (!item) {
        return res.status(404).json({ message: `${label} with id ${req.params.id} not found` });
      }
      await item.update(req.body);
      res.status(200).json(item);
    }),

    // DELETE /resource/:id
    remove: asyncHandler(async (req, res) => {
      const item = await model.findByPk(req.params.id);
      if (!item) {
        return res.status(404).json({ message: `${label} with id ${req.params.id} not found` });
      }
      await item.destroy();
      res.status(200).json({ message: `${label} with id ${req.params.id} has been deleted` });
    }),
  };
}

module.exports = crudFactory;
