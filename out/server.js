"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//const express = require('express') // expess module
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var index_1 = __importDefault(require("./routes/api/index"));
var app = express_1.default(); // server instance
app.use(express_1.default.json()); // helps in sending json data
// helps in encoding url
app.use(express_1.default.urlencoded({
    extended: true
}));
app.use('/', express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use(function (req, res, next) {
    //console.log("middle")
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/', index_1.default); // it will mount index.js on this path
// listen on 8000 port number of local host
app.listen(process.env.PORT || 8000, function () { return console.log("server started at 8000"); });
