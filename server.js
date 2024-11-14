"use strict";
const express = require("express");
const chalk = require("chalk");
const fs = require('fs');
const path = require('path');
// const createHttpServer = require('./httpServer');
const { createHttpServer } = require('./httpServer');
const swaggerSpec = require('./swagger');
const swaggerUi = require("swagger-ui-express");
const swaggerSetup = require('./swagger');
const bodyParser = require('body-parser');
const routes = require("./routes");
const cors = require("./utils/cors"); // Import your existing CORS middleware

// VERSION CONTROL
//--npm run build --
const versionFilePath = path.join(__dirname, 'package.json');
const versionFileContent = fs.readFileSync(versionFilePath, 'utf-8');
const versionData = JSON.parse(versionFileContent);
const version = `${versionData.name.toUpperCase()} : V ${versionData.version}`;
const currentDate = new Date();
console.log(chalk.yellow(`------------ Current Date Time: ${currentDate} ------------`));
console.log(chalk.green(version));
// VERSION CONTROL
const app = express();
//Swagger Setup
swaggerSetup(app); // Add this line to set up Swagger
// Middleware
app.use(require("./utils/init"));
app.use(bodyParser.urlencoded({ extended: true, limit: "500mb" }));
app.use(bodyParser.json({ limit: "500mb" }));
app.use(cors); // Use your existing CORS middleware
// Create HTTP, HTTPS server and WebSocket server
createHttpServer();
