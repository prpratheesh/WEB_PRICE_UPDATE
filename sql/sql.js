"use strict";
const chalk=require("chalk");
require("dotenv").config();
const sql = require("mssql");

/////////////////////////////////////////SQL CONFIG FROM JSON///////////////////////////////////////
// const config = {
//   user: process.env.SQL_USER,
//   password: process.env.SQL_PASSWORD,
//   server: process.env.SQL_SERVER,
//   database: process.env.SQL_DATABASE,
//   connectionTimeout: 300000,
//   requestTimeout: 300000,
//   pool: {
//     idleTimeoutMillis: 300000,
//     max: 100
// },
//   options: {
//     connectionLimit : 20,
//     enableArithAbort: true,
//     encrypt: false,
//     rowCollectionOnRequestCompletion: true,
//   },
// };
/////////////////////////////////////////SQL CONFIG FROM JSON///////////////////////////////////////
/////////////////////////////////////////SQL CONFIG FROM ENV////////////////////////////////////////
const config = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  connectionTimeout: 300000,
  requestTimeout: 300000,
  pool: {
    idleTimeoutMillis: 300000,
    max: 100
},
  options: {
    connectionLimit : 20,
    enableArithAbort: true,
    encrypt: false,
    rowCollectionOnRequestCompletion: true,
  },
};
/////////////////////////////////////////SQL CONFIG FROM ENV////////////////////////////////////////
///////////////////////////////////////////SQL CONFIG RAW///////////////////////////////////////////
// const sql = require("mssql");
// const config = {
//   user: "sa",
//   password: "sa@123456",
//   server: "REDQUEEN\\MSSQLSERVER2014",
//   database: "WEBAPI",
//   options: {
//     enableArithAbort: true,
//     encrypt: false,
//     rowCollectionOnRequestCompletion: true,
//   },
// };
///////////////////////////////////////////SQL CONFIG RAW///////////////////////////////////////////
////////////////////////////////////////OTHER CONFIG FROM ENV///////////////////////////////////////
const genconfig = {
  directory : process.env.IMAGE_PATH,
  msgdirectory : process.env.MSG_PATH,
  logodirectory : process.env.LOGO_PATH,
  firebaseTimer : process.env.TIMER_FIREBASE
}
////////////////////////////////////////OTHER CONFIG FROM ENV///////////////////////////////////////
/////////////////////////////////////////////SQL POOL/////////////////////////////////////////////
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log(chalk.blue('CONNECTED TO MSSQL'));
    return pool;
  })
  .catch((err) => console.log("CANNOT CONNECT TO MSSQL: ", err));
module.exports = {
  sql,
  poolPromise,
  genconfig,
};
/////////////////////////////////////////////SQL POOL/////////////////////////////////////////////
