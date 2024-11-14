"use strict";
const chalk = require("chalk");
const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();
const { poolPromise } = require("./sql/sql")
const sql = require("mssql");
const fs = require('fs'); 
const path = require('path');
const http = require('http');
const https = require('https');
const { v4: uuidv4 } = require('uuid'); // Import uuid module to generate unique IDs
//////////////////////////////////////////////////////////////////////////////////////
//                          ONLY USE BELOW STATUS CODES                             //
//////////////////////////////////////////////////////////////////////////////////////
//                          200 - OK                                                //
//                          201 - CREATED                                           //            
//                          202 - ACCEPTED                                          //    
//                          400 - BAD REQUEST                                       //        
//                          401 - UNAUTHARIZED                                      //        
//                          403 - FORBIDDEN                                         //
//                          404 - NOT FOUND                                         //    
//                          405 - METHOD NOT ALLOWED                                //
//                          408 - REQUEST TIMEOUT                                   //
//                          500 - INTERNAL SERVER ERROR                             //
//                          501 - NOT IMPLEMENTED                                   //
//////////////////////////////////////////////////////////////////////////////////////
router.get('/test', (req, res) => {
    res.send('Test route is working!');
});
//////////////////////////FUNCTION TO GENERATE UNIQUE THREAD ID/////////////////////////
function generateThreadId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}
//////////////////////////FUNCTION TO GENERATE UNIQUE THREAD ID/////////////////////////
///////////////////////////////////UPDATE ALL ARTICLE///////////////////////////////////
router.get("/WEB_API/UpdateAllArticles", async (req, res) => {
    const threadId = generateThreadId(); // Generate a unique thread ID for each request
    console.log(chalk.bgMagentaBright(`${new Date().toLocaleString()} - THREAD ID: ${threadId} - FETCHING ALL ARTICLE INFO STARTED.`));
    res.header("content-type: application/json");
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .execute("GetProfileAll")
            .then((result) => {
                var stat = result.recordsets[0].length;
                if (stat >= 1) {
                    console.log(chalk.bgBlueBright(`${new Date().toLocaleString()} - THREAD ID: ${threadId} - SUCCESS FETCHING ${stat} RECORDS.`));
                    var val = JSON.stringify(result.recordset);

                    // Set up data and options for the HTTP POST request
                    const postData = JSON.stringify(result.recordset);
                    const dataSize = Buffer.byteLength(postData, 'utf8');
                    const dataSizeMB = (dataSize / (1024 * 1024)).toFixed(2);
                    const options = {
                        hostname: '4f6e1070dab24d29ac33bc24c0d6ad3a.api.mockbin.io',
                        path: '/',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': Buffer.byteLength(postData),
                        },
                    };

                    // Make the HTTP POST request
                    const postReq = https.request(options, (postRes) => {
                        let data = '';
                        postRes.on('data', (chunk) => (data += chunk));
                        postRes.on('end', () => {
                            console.log(chalk.bgCyanBright(`- THREAD ID: ${threadId} - DATA SIZE: ${dataSizeMB} MB`));
                            console.log(chalk.bgYellow(`${new Date().toLocaleString()} - THREAD ID: ${threadId} - DATA POSTED SUCCESSFULLY TO EXTERNAL URL.`));
                        });
                    });

                    // Handle errors in the POST request
                    postReq.on('error', (e) => {
                        console.log(chalk.red(`${new Date().toLocaleString()} - THREAD ID: ${threadId} - ERROR POSTING DATA TO EXTERNAL URL: ${e.message}`));
                    });

                    // Write data to request body
                    postReq.write(postData);
                    postReq.end();

                    // Send the original response back to the client
                    // res.status(200).send(`- THREAD ID: ${threadId} - SUCCESS FETCHING ${stat} RECORDS.`);
                    res.status(200).send(postData);
                } else {
                    console.log(chalk.bgRed(`${new Date().toLocaleString()} - THREAD ID: ${threadId} - DATABASE EMPTY.`));
                    res.status(204).end();
                }
            });
    } catch (err) {
        res.status(500);
        console.log(chalk.bgRed(`${new Date().toLocaleString()} - THREAD ID: ${threadId} - EXCEPTION: ${err.message}.`));
        res.send("Error while retrieving all barcodes. " + err.message);
    }
    console.log(chalk.bgMagentaBright(`${new Date().toLocaleString()} - THREAD ID: ${threadId} - FETCHING ALL ARTICLE INFO COMPLETED.`));
});
///////////////////////////////////UPDATE ALL ARTICLE///////////////////////////////////
//////////////////////////////////UPDATE SINGLE ARTICLE/////////////////////////////////
router.get("/WEB_API/UpdateSingleArticle", async (req, res) => {
    const threadId = generateThreadId(); // Generate a unique thread ID for each request
    console.log(chalk.bgMagentaBright(`${new Date().toLocaleString()} - THREAD ID: ${threadId} - FETCHING ALL ARTICLE INFO STARTED.`));
    res.header("content-type: application/json");
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .execute("GetProfileAll")
            .then((result) => {
                var stat = result.recordsets[0].length;
                if (stat >= 1) {
                    console.log(chalk.bgBlueBright(`${new Date().toLocaleString()} - THREAD ID: ${threadId} - SUCCESS FETCHING ${stat} RECORDS.`));
                    var val = JSON.stringify(result.recordset);

                    // Set up data and options for the HTTP POST request
                    const postData = JSON.stringify(result.recordset);
                    const dataSize = Buffer.byteLength(postData, 'utf8');
                    const dataSizeMB = (dataSize / (1024 * 1024)).toFixed(2);
                    const options = {
                        hostname: '4f6e1070dab24d29ac33bc24c0d6ad3a.api.mockbin.io',
                        path: '/',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': Buffer.byteLength(postData),
                        },
                    };

                    // Make the HTTP POST request
                    const postReq = https.request(options, (postRes) => {
                        let data = '';
                        postRes.on('data', (chunk) => (data += chunk));
                        postRes.on('end', () => {
                            console.log(chalk.bgCyanBright(`- THREAD ID: ${threadId} - DATA SIZE: ${dataSizeMB} MB`));
                            console.log(chalk.bgYellow(`${new Date().toLocaleString()} - THREAD ID: ${threadId} - DATA POSTED SUCCESSFULLY TO EXTERNAL URL.`));
                        });
                    });

                    // Handle errors in the POST request
                    postReq.on('error', (e) => {
                        console.log(chalk.red(`${new Date().toLocaleString()} - THREAD ID: ${threadId} - ERROR POSTING DATA TO EXTERNAL URL: ${e.message}`));
                    });

                    // Write data to request body
                    postReq.write(postData);
                    postReq.end();

                    // Send the original response back to the client
                    // res.status(200).send(`- THREAD ID: ${threadId} - SUCCESS FETCHING ${stat} RECORDS.`);
                    res.status(200).send(postData);
                } else {
                    console.log(chalk.bgRed(`${new Date().toLocaleString()} - THREAD ID: ${threadId} - DATABASE EMPTY.`));
                    res.status(204).end();
                }
            });
    } catch (err) {
        res.status(500);
        console.log(chalk.bgRed(`${new Date().toLocaleString()} - THREAD ID: ${threadId} - EXCEPTION: ${err.message}.`));
        res.send("Error while retrieving all barcodes. " + err.message);
    }
    console.log(chalk.bgMagentaBright(`${new Date().toLocaleString()} - THREAD ID: ${threadId} - FETCHING ALL ARTICLE INFO COMPLETED.`));
});
//////////////////////////////////UPDATE SINGLE ARTICLE/////////////////////////////////
module.exports = router;
