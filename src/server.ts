//const express = require('express') // expess module
import express from 'express';
import path from 'path'
import indexRoute from './routes/api/index';
const app = express() // server instance

app.use(express.json()) // helps in sending json data
// helps in encoding url
app.use(express.urlencoded({
  extended: true
}))


app.use('/',express.static(path.join(__dirname,'../public')))
app.use(function(req, res, next) {
  //console.log("middle")
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', indexRoute); // it will mount index.js on this path


// listen on 8000 port number of local host
app.listen(process.env.PORT || 8000,()=>console.log("server started at 8000"));
