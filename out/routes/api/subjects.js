"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var db_1 = require("../../db");
var courseUrlValidators_1 = require("../../validators/courseUrlValidators");
var route = express_1.Router();
//get all subjects from the database 
route.get('/', function (req, res) {
    db_1._Subject.findAll().then(function (subjects) { return res.status(200).send({
        subjects: subjects,
        status: true
    }); }).catch(function (err) {
        res.status(503).send({
            error: 'Error while getting subjects',
            status: false
        });
    });
});
//add new subject ,pass subject name and course id  as the body parameter
route.post('/', function (req, res) {
    var body = req.body;
    if (!(courseUrlValidators_1.courseNameValidator(req.body.subjectName) && (courseUrlValidators_1.courseIdValidator(body.courseId)))) {
        return res.status(403).send({
            error: 'Subject Name or courseId cant be undefined or empty',
            status: false
        });
    }
    var subjectName = body.subjectName;
    var courseId = parseInt(body.courseId);
    db_1._Subject.create({
        name: subjectName,
        courseId: courseId
    }).then(function (subject) {
        res.status(201).send({
            subject: subject,
            status: true
        });
    }).catch(function (err) {
        console.log(err);
        res.status(503).send({
            error: 'Error while adding new subject',
            status: false
        });
    });
});
//get subject information with respective id
route.get('/:id', function (req, res) {
    if (!courseUrlValidators_1.courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid subject id',
            status: false
        });
    }
    var subjectId = parseInt(req.params.id);
    db_1._Subject.findOne({
        where: {
            id: subjectId
        }
    }).then(function (subject) { return res.status(200).send({
        subject: subject,
        status: true
    }); }).catch(function (err) {
        res.status(503).send({
            error: 'Error while getting subjects',
            status: false
        });
    });
});
//delete particular subject from the db
route.delete('/:id', function (req, res) {
    if (!courseUrlValidators_1.courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid subject id',
            status: false
        });
    }
    var subjectId = parseInt(req.params.id);
    db_1._Subject.destroy({
        where: {
            id: subjectId
        }
    }).then(function (rows) {
        res.status(200).send({
            deletedRows: rows,
            status: true,
            message: 'deleted successfully'
        });
    }).catch(function (err) {
        res.status(503).send({
            error: 'Error deleting the subject',
            status: false
        });
    });
});
//updating name of the subject with the corresponding subject id
route.put('/:id', function (req, res) {
    var body = req.body;
    if (!courseUrlValidators_1.courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid subject id',
            status: false
        });
    }
    var subjectId = parseInt(req.params.id);
    if (!courseUrlValidators_1.courseNameValidator(body.subjectName)) {
        return res.status(403).send({
            error: 'Subject Name cant be undefined or empty',
            status: false
        });
    }
    var subjectName = body.subjectName;
    db_1._Subject.findOne({
        where: {
            id: subjectId
        }
    }).then(function (subject) {
        subject.set('name', subjectName);
        subject.save().then(function (updatedSubject) {
            res.status(200).send({
                subject: updatedSubject,
                status: true
            });
        }).catch(function (err) {
            res.status(503).send({
                error: 'Error updating subject"s info',
                status: false
            });
        });
    }).catch(function (err) {
        res.status(503).send({
            error: 'Error while getting subjects',
            status: false
        });
    });
});
//get teachers for particular subject
route.get('/:id/teachers', function (req, res) {
    if (!courseUrlValidators_1.courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid subject id',
            status: false
        });
    }
    var subjectId = parseInt(req.params.id);
    db_1._Subject.findOne({
        where: {
            id: subjectId
        },
        include: [{
                model: db_1._Teacher
            }]
    }).then(function (subject) { return res.status(200).send({
        subject: subject,
        status: true
    }); }).catch(function (err) {
        res.status(503).send({
            error: 'Error while getting subjects',
            status: false
        });
    });
});
exports.default = route;
