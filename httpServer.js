const express = require("express");
const http = require('http');
const https = require('https');
const WebSocket = require('ws');
const os = require('os');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const app = express();
const { poolPromise, genconfig } = require("./sql/sql");
const sql = require("mssql");
const bodyParser = require("body-parser");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const mdns = require('multicast-dns');

app.use(require('./utils/init'));
app.use(bodyParser.urlencoded({ extended: true, limit: "500mb" }));
app.use(bodyParser.json({ limit: "500mb" }));
app.use(require('./utils/cors'));

const routes = require('./routes'); // Import the routes from routes.js
app.use("/", routes); // Use the routes

app.use("/", express.static("assets"));
app.set("view engine", "ejs");
const { getLocation } = require('./routes');
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// SSL/TLS CERTIFICATE
const privateKey = fs.readFileSync('./cert/key.pem', 'utf8');
const certificate = fs.readFileSync('./cert/cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };
// SSL/TLS CERTIFICATE

const http_port = process.env.HTTP_PORT || 3000;
const https_port = process.env.HTTPS_PORT || 3001;

const connectedClients = new Set();

//MULTICAST DNS
const mdnsServer = mdns();
//MULTICAST DNS

// Function to send data to all connected clients
function sendToAllClients(message) {
  connectedClients.forEach((client) => {
    client.send(message);
  });
}

function createHttpServer() {
  const serverIp = getServerIp();
  mdnsServer.on('query', function (query) {
    if (query.questions[0] && query.questions[0].name === '_http._tcp.local') {
      mdnsServer.respond({
        answers: [{
          type: 'PTR',
          name: '_http._tcp.local',
          data: 'example-server',
          ttl: 120,
        }],
      });
    }
  });
  function listenHttp() {
    const server = http.createServer(app);
    server.listen(http_port, () => {
      console.log(chalk.blue(`HTTP  SERVER STARTED: ${serverIp}:${http_port}`));
      console.log(chalk.yellow(`SWAGGER CAN BE ACCESSED AT: http://${serverIp}:${http_port}/swagger`));
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(chalk.red(`HTTP SERVER PORT ${http_port} IS BUSY, TRYING WITH PORT ${http_port + 1}...`));
        console.log(chalk.yellow(`SWAGGER CAN BE ACCESSED AT: http://${serverIp}:${http_port + 1}/swagger`));
        listenHttp(http_port + 1);
      } else {
        throw err;
      }
    });

    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
      connectedClients.add(ws);
      ws.on('message', (message) => {
        // Handle WebSocket messages here
      });
      ws.on('close', () => {
        connectedClients.delete(ws);
      });
    });
  }

  function listenHttps() {
    const server = https.createServer(credentials, app);
    server.listen(https_port, () => {
      console.log(chalk.blue(`HTTPS SERVER STARTED: ${serverIp}:${https_port}`));
      console.log(chalk.yellow(`SWAGGER CAN BE ACCESSED AT: https://${serverIp}:${https_port}/swagger`));
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(chalk.red(`HTTPS SERVER PORT ${https_port} IS BUSY, TRYING WITH PORT ${https_port + 1}...`));
        console.log(chalk.yellow(`SWAGGER CAN BE ACCESSED AT: https://${serverIp}:${https_port + 1}/swagger`));
        listenHttps(https_port + 1, credentials);
      } else {
        throw err;
      }
    });

    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
      connectedClients.add(ws);
      ws.on('message', (message) => {
        // Handle WebSocket messages here
      });
      ws.on('close', () => {
        connectedClients.delete(ws);
      });
    });
  }

  function getServerIp() {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
      const addresses = interfaces[interfaceName];
      for (const address of addresses) {
        if (address.family === 'IPv4' && !address.internal) {
          return address.address;
        }
      }
    }
    return 'Unknown';
  }

  listenHttp();
  listenHttps();
}

module.exports = {
  createHttpServer,
  sendToAllClients,
};
