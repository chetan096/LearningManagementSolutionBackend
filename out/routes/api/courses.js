"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var db_1 = require("../../db");
var batches_1 = __importDefault(require("./batches"));
var courseUrlValidators_1 = require("../../validators/courseUrlValidators");
var route = express_1.Router();
//get all courses from the database
route.get('/', function (req, res) {
    db_1._Course.findAll().then(function (courses) { return res.status(200).send({
        courses: courses,
        status: true
    }); }).catch(function (err) {
        res.status(503).send({
            error: 'Error in getting courses',
            status: false
        });
    });
});
//get particular course with the respective id from the database
route.get('/:id', function (req, res) {
    var courseId = req.params.id;
    if (courseUrlValidators_1.courseIdValidator(courseId) == false) {
        return res.status(403).send({
            error: 'Invalid course id',
            status: false
        });
    }
    db_1._Course.find({
        where: {
            id: courseId
        }
    }).then(function (course) {
        res.status(200).send({
            course: course,
            status: true
        });
    })
        .catch(function (err) {
        res.status(503).send({
            error: 'Error getting course ',
            status: false
        });
    });
});
//adding new course to the db, pass courseName as body parameter
route.post('/', function (req, res) {
    var body = req.body;
    var courseName = body.courseName;
    if (courseUrlValidators_1.courseNameValidator(courseName) == false) {
        return res.status(403).send({
            error: 'Course Name cant be undefined or empty',
            status: false
        });
    }
    db_1._Course.create({
        name: courseName
    }).then(function (course) {
        res.status(200).send({
            status: true,
            course: course
        });
    }).catch(function (err) {
        console.log(err);
        res.status(503).send({
            error: 'Error while adding course',
            status: false
        });
    });
});
//update coursename of course with passed id,pass new course name as body parameter
route.put('/:id', function (req, res) {
    var courseId = req.params.id;
    if (!courseUrlValidators_1.courseIdValidator(courseId)) {
        return res.status(403).send({
            error: 'Invalid course id',
            status: false
        });
    }
    var body = req.body;
    var courseName = body.courseName;
    if (!courseUrlValidators_1.courseNameValidator(courseName)) {
        return res.status(403).send({
            error: 'Course Name cant be undefined or empty',
            status: false
        });
    }
    db_1._Course.find({
        where: {
            id: courseId
        }
    }).then(function (course) {
        course.set('name', courseName);
        course.save().then(function (course) {
            res.status(200).send({
                course: course,
                status: true
            });
        }).catch(function (err) {
            res.status(503).send({
                error: 'Error while updating course name',
                status: false
            });
        });
    })
        .catch(function (err) {
        res.status(503).send({
            error: 'Error updating course name',
            status: false
        });
    });
});
//delete course with the corresponding id
route.delete('/:id', function (req, res) {
    if (!courseUrlValidators_1.courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid course id',
            status: false
        });
    }
    var courseId = parseInt(req.params.id);
    db_1._Course.destroy({
        where: {
            id: courseId
        }
    }).then(function (rows) {
        res.status(200).send({
            deletedRows: rows,
            status: true,
            message: 'deleted successfully'
        });
    }).catch(function (err) {
        res.status(503).send({
            error: 'Error deleting the student',
            status: false
        });
    });
});
//if not matched with any above then let it fallback to this url that will use batch route further
route.use('/:id/batches', batches_1.default);
exports.default = route;
