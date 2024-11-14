"use strict";
const cors=(req, res, next)=> {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT,OPTIONS");
  res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,contentType,Content-Type,Accept,Authorization");
  next();
}
module.exports=cors;