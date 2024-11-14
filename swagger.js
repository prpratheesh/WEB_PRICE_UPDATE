const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc"); // Import swagger-jsdoc
const express = require('express'); // Import Express

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'WEBSITE_PRICE_UPDATE',
    version: '1.0.0',
    description: 'API to update ERP retail price to website',
  },
  servers: [
    {
      url: 'http://localhost:3000', // replace with your server URL
      description: 'LOCAL SERVER',
    },
  ],
  paths: {
    "/WEB_API/UpdateAllArticles": {
      get: {
        tags: ['Article Management'],
        summary: 'Fetch and update all article information',
        description: 'Fetch all articles from the database and post the data to an external URL.',
        operationId: 'updateAllArticles',
        responses: {
          200: {
            description: 'Articles fetched and posted successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      // Define the structure of each article object
                      articleId: { type: 'string', example: '12345' },
                      articleName: { type: 'string', example: 'Article Name' },
                      price: { type: 'number', example: 99.99 },
                      // Add any other relevant fields here
                    },
                  },
                },
              },
            },
          },
          204: {
            description: 'No content found.',
          },
          500: {
            description: 'Internal server error.',
            content: {
              'application/json': {
                schema: {
                  type: 'string',
                  example: 'Error message',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Path to the API routes (ensure this is correct for your project structure)
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsDoc(options); // Use options instead of swaggerDefinition

module.exports = (app) => {
  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
