// OpenAPI 3.0 specification, served via swagger-ui-express at GET /docs.
// Plain JS object (no swagger-jsdoc / YAML) so the whole spec lives in one
// place instead of being scattered as comments across every route file.

const bearerAuth = { bearerAuth: [] };

const schemas = {
  Error: {
    type: 'object',
    properties: {
      message: { type: 'string' },
      errors: { type: 'array', items: { type: 'string' } },
    },
  },

  Region: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      name: { type: 'string', example: 'Asia' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  RegionInput: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', example: 'Asia' },
    },
  },

  Country: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      name: { type: 'string', example: 'Indonesia' },
      regionId: { type: 'integer', example: 1 },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  CountryInput: {
    type: 'object',
    required: ['name', 'regionId'],
    properties: {
      name: { type: 'string', example: 'Indonesia' },
      regionId: { type: 'integer', example: 1 },
    },
  },

  Location: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      street_address: { type: 'string', example: 'Jl. Merdeka No. 1' },
      postal_code: { type: 'integer', example: 40115 },
      city: { type: 'string', example: 'Bandung' },
      state_province: { type: 'string', example: 'West Java' },
      countryId: { type: 'integer', example: 1 },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  LocationInput: {
    type: 'object',
    required: ['city', 'countryId'],
    properties: {
      street_address: { type: 'string' },
      postal_code: { type: 'integer' },
      city: { type: 'string', example: 'Bandung' },
      state_province: { type: 'string' },
      countryId: { type: 'integer', example: 1 },
    },
  },

  Department: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      name: { type: 'string', example: 'Engineering' },
      locationId: { type: 'integer', example: 1 },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  DepartmentInput: {
    type: 'object',
    required: ['name', 'locationId'],
    properties: {
      name: { type: 'string', example: 'Engineering' },
      locationId: { type: 'integer', example: 1 },
    },
  },

  Job: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      title: { type: 'string', example: 'Backend Developer' },
      min_salary: { type: 'integer', example: 5000000 },
      max_salary: { type: 'integer', example: 15000000 },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  JobInput: {
    type: 'object',
    required: ['title'],
    properties: {
      title: { type: 'string', example: 'Backend Developer' },
      min_salary: { type: 'integer', example: 5000000 },
      max_salary: { type: 'integer', example: 15000000 },
    },
  },

  Employee: {
    type: 'object',
    description: 'password is never returned by the API.',
    properties: {
      id: { type: 'integer', example: 1 },
      first_name: { type: 'string', example: 'Budi' },
      last_name: { type: 'string', example: 'Santoso' },
      email: { type: 'string', format: 'email', example: 'budi@test.com' },
      phone_number: { type: 'string', example: '0812345678' },
      hire_date: { type: 'string', format: 'date' },
      jobId: { type: 'integer', nullable: true, example: 1 },
      salary: { type: 'integer', example: 8000000 },
      role: { type: 'string', enum: ['employee', 'admin'], example: 'employee' },
      image: { type: 'string', nullable: true },
      departmentId: { type: 'integer', nullable: true, example: 1 },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  EmployeeCreateInput: {
    type: 'object',
    required: ['first_name', 'last_name', 'email', 'password'],
    properties: {
      first_name: { type: 'string', example: 'Budi' },
      last_name: { type: 'string', example: 'Santoso' },
      email: { type: 'string', format: 'email', example: 'budi@test.com' },
      password: { type: 'string', format: 'password', example: 'rahasia123' },
      phone_number: { type: 'string' },
      hire_date: { type: 'string', format: 'date' },
      jobId: { type: 'integer' },
      salary: { type: 'integer' },
      role: { type: 'string', enum: ['employee', 'admin'] },
      image: { type: 'string' },
      departmentId: { type: 'integer' },
    },
  },
  EmployeeUpdateInput: {
    type: 'object',
    description: 'Any subset of fields. Non-admin callers may only update their own record and cannot change role.',
    properties: {
      first_name: { type: 'string' },
      last_name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', format: 'password' },
      phone_number: { type: 'string' },
      hire_date: { type: 'string', format: 'date' },
      jobId: { type: 'integer' },
      salary: { type: 'integer' },
      role: { type: 'string', enum: ['employee', 'admin'], description: 'admin only' },
      image: { type: 'string' },
      departmentId: { type: 'integer' },
    },
  },

  Dependent: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      first_name: { type: 'string', example: 'Citra' },
      last_name: { type: 'string', example: 'Santoso' },
      relationship: { type: 'string', example: 'child' },
      employeeId: { type: 'integer', example: 1 },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  DependentInput: {
    type: 'object',
    required: ['first_name', 'last_name', 'employeeId'],
    properties: {
      first_name: { type: 'string', example: 'Citra' },
      last_name: { type: 'string', example: 'Santoso' },
      relationship: { type: 'string', example: 'child' },
      employeeId: { type: 'integer', example: 1 },
    },
  },

  RegisterInput: {
    type: 'object',
    required: ['first_name', 'last_name', 'email', 'password'],
    properties: {
      first_name: { type: 'string', example: 'Ana' },
      last_name: { type: 'string', example: 'Admin' },
      email: { type: 'string', format: 'email', example: 'ana@test.com' },
      password: { type: 'string', format: 'password', example: 'secret123' },
    },
  },
  LoginInput: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email', example: 'ana@test.com' },
      password: { type: 'string', format: 'password', example: 'secret123' },
    },
  },
  AuthResponse: {
    type: 'object',
    properties: {
      employee: { $ref: '#/components/schemas/Employee' },
      token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
    },
  },
};

// Reusable response blocks.
const responses = {
  Unauthorized: {
    description: 'Missing, invalid, or expired token',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
  },
  Forbidden: {
    description: 'Authenticated but not allowed to perform this action',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
  },
  NotFound: {
    description: 'Resource not found',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
  },
  ValidationError: {
    description: 'Validation error (missing/invalid fields, duplicate value, or bad foreign key)',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
  },
};

// Builds the standard 5-route CRUD path block for a simple resource.
function crudPaths({ tag, path, itemSchema, inputSchema, searchDesc, writeSecurity }) {
  return {
    [`/${path}`]: {
      get: {
        tags: [tag],
        summary: `List ${tag.toLowerCase()}s`,
        description: `Supports \`?search=\` (${searchDesc}) and equality filters on any column, e.g. \`?regionId=1\`.`,
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: `Partial match on ${searchDesc}` },
        ],
        responses: {
          200: {
            description: 'List of records',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: `#/components/schemas/${itemSchema}` } } } },
          },
        },
      },
      post: {
        tags: [tag],
        summary: `Create a ${tag.toLowerCase()}`,
        security: writeSecurity,
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: `#/components/schemas/${inputSchema}` } } },
        },
        responses: {
          201: { description: 'Created', content: { 'application/json': { schema: { $ref: `#/components/schemas/${itemSchema}` } } } },
          400: responses.ValidationError,
          401: responses.Unauthorized,
          403: responses.Forbidden,
        },
      },
    },
    [`/${path}/{id}`]: {
      get: {
        tags: [tag],
        summary: `Get one ${tag.toLowerCase()} by id`,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Record found', content: { 'application/json': { schema: { $ref: `#/components/schemas/${itemSchema}` } } } },
          404: responses.NotFound,
        },
      },
      put: {
        tags: [tag],
        summary: `Update a ${tag.toLowerCase()}`,
        security: writeSecurity,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: `#/components/schemas/${inputSchema}` } } },
        },
        responses: {
          200: { description: 'Updated', content: { 'application/json': { schema: { $ref: `#/components/schemas/${itemSchema}` } } } },
          400: responses.ValidationError,
          401: responses.Unauthorized,
          403: responses.Forbidden,
          404: responses.NotFound,
        },
      },
      delete: {
        tags: [tag],
        summary: `Delete a ${tag.toLowerCase()}`,
        security: writeSecurity,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Deleted' },
          401: responses.Unauthorized,
          403: responses.Forbidden,
          404: responses.NotFound,
        },
      },
    },
  };
}

const paths = {
  '/': {
    get: {
      tags: ['Root'],
      summary: 'Health check / welcome message',
      responses: { 200: { description: 'OK' } },
    },
  },

  '/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Register a new employee account',
      description: 'Always creates the account with role `employee`, regardless of any `role` field sent.',
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } } },
      },
      responses: {
        201: { description: 'Account created', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
        400: responses.ValidationError,
      },
    },
  },
  '/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Log in and receive a JWT',
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } },
      },
      responses: {
        200: { description: 'Logged in', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
        401: { description: 'Invalid email or password', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      },
    },
  },
  '/auth/me': {
    get: {
      tags: ['Auth'],
      summary: 'Get the currently authenticated employee',
      security: [bearerAuth],
      responses: {
        200: { description: 'Current employee', content: { 'application/json': { schema: { $ref: '#/components/schemas/Employee' } } } },
        401: responses.Unauthorized,
      },
    },
  },

  ...crudPaths({ tag: 'Region', path: 'regions', itemSchema: 'Region', inputSchema: 'RegionInput', searchDesc: 'name', writeSecurity: [bearerAuth] }),
  ...crudPaths({ tag: 'Country', path: 'countries', itemSchema: 'Country', inputSchema: 'CountryInput', searchDesc: 'name', writeSecurity: [bearerAuth] }),
  ...crudPaths({ tag: 'Location', path: 'locations', itemSchema: 'Location', inputSchema: 'LocationInput', searchDesc: 'city', writeSecurity: [bearerAuth] }),
  ...crudPaths({ tag: 'Department', path: 'departments', itemSchema: 'Department', inputSchema: 'DepartmentInput', searchDesc: 'name', writeSecurity: [bearerAuth] }),
  ...crudPaths({ tag: 'Job', path: 'jobs', itemSchema: 'Job', inputSchema: 'JobInput', searchDesc: 'title', writeSecurity: [bearerAuth] }),
  ...crudPaths({ tag: 'Dependent', path: 'dependents', itemSchema: 'Dependent', inputSchema: 'DependentInput', searchDesc: 'first_name', writeSecurity: [bearerAuth] }),

  '/employees': {
    get: {
      tags: ['Employee'],
      summary: 'List employees',
      description: 'Requires login. Supports `?search=` (partial match on first/last name or email) and equality filters, e.g. `?departmentId=1`.',
      security: [bearerAuth],
      parameters: [{ name: 'search', in: 'query', schema: { type: 'string' } }],
      responses: {
        200: { description: 'List of employees', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Employee' } } } } },
        401: responses.Unauthorized,
      },
    },
    post: {
      tags: ['Employee'],
      summary: 'Create an employee (admin only)',
      description: 'For self-service signup use POST /auth/register instead.',
      security: [bearerAuth],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/EmployeeCreateInput' } } },
      },
      responses: {
        201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Employee' } } } },
        400: responses.ValidationError,
        401: responses.Unauthorized,
        403: responses.Forbidden,
      },
    },
  },
  '/employees/{id}': {
    get: {
      tags: ['Employee'],
      summary: 'Get one employee by id',
      security: [bearerAuth],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: {
        200: { description: 'Employee found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Employee' } } } },
        401: responses.Unauthorized,
        404: responses.NotFound,
      },
    },
    put: {
      tags: ['Employee'],
      summary: 'Update an employee',
      description: 'Only the employee themself or an admin may update a record. Only an admin may change `role`.',
      security: [bearerAuth],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/EmployeeUpdateInput' } } },
      },
      responses: {
        200: { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Employee' } } } },
        400: responses.ValidationError,
        401: responses.Unauthorized,
        403: responses.Forbidden,
        404: responses.NotFound,
      },
    },
    delete: {
      tags: ['Employee'],
      summary: 'Delete an employee (admin only)',
      security: [bearerAuth],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: {
        200: { description: 'Deleted' },
        401: responses.Unauthorized,
        403: responses.Forbidden,
        404: responses.NotFound,
      },
    },
  },
};

const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'HR Application API',
    version: '1.0.0',
    description:
      'REST API for a simple HR application (regions, countries, locations, departments, jobs, employees, dependents) with JWT authentication.',
  },
  servers: [{ url: '/', description: 'Current server' }],
  tags: [
    { name: 'Root' },
    { name: 'Auth' },
    { name: 'Region' },
    { name: 'Country' },
    { name: 'Location' },
    { name: 'Department' },
    { name: 'Job' },
    { name: 'Employee' },
    { name: 'Dependent' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas,
  },
  paths,
};

module.exports = swaggerSpec;
