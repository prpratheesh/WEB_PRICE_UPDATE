"use strict";
const { lookup } = require('dns');
const myLogger=(req, res, next)=> {
  let clientIp = req.ip;
  if (clientIp.startsWith('::ffff:')) {
    clientIp = clientIp.slice(7);
  }
  // Reverse DNS lookup to get the hostname
  lookup(clientIp, (err, hostname) => {
    if (!err) {
      console.log(`CLIENT CONNECTED: IP ADDRESS: ${clientIp} | HOSTNAME: ${hostname}`);
    } else {
      console.log(`Client IP: ${clientIp}`);
    }
  });

  next();
}
module.exports=myLogger;