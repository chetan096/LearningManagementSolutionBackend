"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//const route=require('express').Router();
var express_1 = require("express");
var courses_1 = __importDefault(require("./courses"));
var students_1 = __importDefault(require("./students"));
var subjects_1 = __importDefault(require("./subjects"));
var teachers_1 = __importDefault(require("./teachers"));
var batches_1 = __importDefault(require("./batches"));
var route = express_1.Router();
var routes = {
    courseRoute: courses_1.default, studentRoute: students_1.default, subjectRoute: subjects_1.default, teacherRoute: teachers_1.default, batchRoute: batches_1.default
};
//will mount courses  on this url
route.use('/courses', routes.courseRoute);
//will mount teachers on this url
route.use('/teachers', routes.teacherRoute);
//will mount students  on this url
route.use('/students', routes.studentRoute);
//will mount subjects  on this url
route.use('/subjects', routes.subjectRoute);
route.use('/', routes.batchRoute);
//export this route
exports.default = route;
