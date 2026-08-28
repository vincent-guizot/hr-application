require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const routes = require('./routes');
const swaggerSpec = require('./docs/swagger');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API docs: GET /docs (Swagger UI) and GET /docs.json (raw OpenAPI spec)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs.json', (req, res) => res.json(swaggerSpec));

app.use(routes);

// 404 for anything that didn't match a route, then the centralized
// error handler for everything thrown/rejected inside controllers.
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('App is listening on port:', PORT);
});

module.exports = app;
