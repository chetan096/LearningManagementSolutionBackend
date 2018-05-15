"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var db_1 = require("../../db");
var courseUrlValidators_1 = require("../../validators/courseUrlValidators");
var route = express_1.Router({ mergeParams: true });
//will get all students
route.get('/', function (req, res) {
    db_1._Student.findAll({
        include: [db_1._Batch]
    }).then(function (students) { return res.status(200).send({
        students: students,
        status: true
    }); }).catch(function (err) {
        res.status(503).send({
            error: 'Error while getting students',
            status: false
        });
    });
});
//add student to the db ,pass studentName as the body parameter
route.post('/', function (req, res) {
    var body = req.body;
    if (!courseUrlValidators_1.courseNameValidator(req.body.studentName)) {
        return res.status(403).send({
            error: 'Student Name cant be undefined or empty',
            status: false
        });
    }
    var studentName = body.studentName;
    db_1._Student.create({
        name: studentName
    }).then(function (student) {
        res.status(201).send({
            student: student,
            status: true
        });
    }).catch(function (err) {
        res.status(503).send({
            error: 'Error while adding new student',
            status: false
        });
    });
});
//will get student of particular id
route.get('/:id', function (req, res) {
    if (!courseUrlValidators_1.courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid student id',
            status: false
        });
    }
    var studentId = parseInt(req.params.id);
    db_1._Student.findOne({
        where: {
            id: studentId
        }
    }).then(function (student) { return res.status(200).send({
        student: student,
        status: true
    }); }).catch(function (err) {
        res.status(503).send({
            error: 'Error while getting students',
            status: false
        });
    });
});
//delete student of corresponding id
route.delete('/:id', function (req, res) {
    if (!courseUrlValidators_1.courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid student id',
            status: false
        });
    }
    var studentId = parseInt(req.params.id);
    db_1._Student.destroy({
        where: {
            id: studentId
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
//update name of the user with the respective id ,pass student Name in the body parameter
route.put('/:id', function (req, res) {
    var body = req.body;
    if (!courseUrlValidators_1.courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid student id',
            status: false
        });
    }
    var studentId = parseInt(req.params.id);
    if (!courseUrlValidators_1.courseNameValidator(body.studentName)) {
        return res.status(403).send({
            error: 'Student Name cant be undefined or empty',
            status: false
        });
    }
    var studentName = body.studentName;
    db_1._Student.findOne({
        where: {
            id: studentId
        }
    }).then(function (student) {
        student.set('name', studentName);
        student.save().then(function (updatedStudent) {
            res.status(200).send({
                student: updatedStudent,
                status: true
            });
        }).catch(function (err) {
            res.status(503).send({
                error: 'Error updating student"s info',
                status: false
            });
        });
    }).catch(function (err) {
        res.status(503).send({
            error: 'Error while getting students',
            status: false
        });
    });
});
//get batches of student with the respective id
route.get('/:id/batches', function (req, res) {
    db_1.StudentBatch.findAll({
        where: {
            studentId: req.params.id
        },
        include: [{
                model: db_1._Student
            },
            {
                model: db_1._Batch
            }
        ]
    }).then(function (data) {
        res.status(200).send({
            data: data,
            status: true
        });
    }).catch(function (err) {
        console.log(err);
        res.status(503).send({
            error: 'Error fetching data',
            status: false
        });
    });
});
//add new batch for the student with the respective id
route.post('/:id/batches', function (req, res) {
    var body = req.body;
    if (!(courseUrlValidators_1.courseIdValidator(req.params.id) && (courseUrlValidators_1.courseIdValidator(req.body.batchId)))) {
        return res.status(403).send({
            error: 'Invalid student id or batch Id',
            status: false
        });
    }
    var studentId = parseInt(req.params.id);
    var batchId = parseInt(body.batchId);
    db_1.StudentBatch.findOne({
        where: {
            studentId: studentId,
            batchId: batchId
        }
    }).then(function (data) {
        if (data) {
            return res.status(403).send({
                error: 'Already enrolled',
                status: false
            });
        }
        else {
            db_1.StudentBatch.create({
                batchId: batchId,
                studentId: studentId
            }).then(function (data) {
                res.status(201).send({
                    data: data,
                    status: true
                });
            }).catch(function (err) {
                console.log(err);
                res.status(503).send({
                    error: 'Error adding student into batch',
                    status: false
                });
            });
        }
    }).catch(function (err) {
        console.log(err);
        res.status(503).send({
            error: 'Error adding students into  batch ',
            status: false
        });
    });
});
exports.default = route;
