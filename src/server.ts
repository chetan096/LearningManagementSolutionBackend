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

app.use('/', indexRoute); // it will mount index.js on this path

// listen on 8000 port number of local host
app.listen(process.env.PORT || 8000,()=>console.log("server started at 8000"));
