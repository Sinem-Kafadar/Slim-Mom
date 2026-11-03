import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SlimMom API',
      version: '1.0.0',
      description: 'Backend API documentation for the SlimMom application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local Server',
      },
      {
        url: 'https://slimmoms-ibjd.onrender.com',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./docs/*.yaml'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;