"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var db_1 = require("../../db");
var courseUrlValidators_1 = require("../../validators/courseUrlValidators");
var route = express_1.Router();
//get all teachers from the databases including their subject information
route.get('/', function (req, res) {
    db_1._Teacher.findAll({
        include: [db_1._Subject]
    }).then(function (teachers) { return res.status(200).send({
        teachers: teachers,
        status: true
    }); }).catch(function (err) {
        res.status(503).send({
            error: 'Error while getting teachers',
            status: false
        });
    });
});
//add new teacher to the db,pass name of the teacher and subjectid in the body parameter
route.post('/', function (req, res) {
    var body = req.body;
    if (!(courseUrlValidators_1.courseNameValidator(req.body.teacherName) && (courseUrlValidators_1.courseIdValidator(body.subjectId)))) {
        return res.status(403).send({
            error: 'Teacher Name or subjectId cant be undefined or empty',
            status: false
        });
    }
    var teacherName = body.teacherName;
    var subjectId = parseInt(body.subjectId);
    db_1._Teacher.create({
        name: teacherName,
        subjectId: subjectId
    }).then(function (teacher) {
        res.status(201).send({
            teacher: teacher,
            status: true
        });
    }).catch(function (err) {
        console.log(err);
        res.status(503).send({
            error: 'Error while adding new teacher',
            status: false
        });
    });
});
//get particular teacher with the passed id
route.get('/:id', function (req, res) {
    if (!courseUrlValidators_1.courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid teacher id',
            status: false
        });
    }
    var teacherId = parseInt(req.params.id);
    db_1._Teacher.findOne({
        where: {
            id: teacherId
        },
        include: [{
                model: db_1._Subject
            }]
    }).then(function (teacher) { return res.status(200).send({
        teacher: teacher,
        status: true
    }); }).catch(function (err) {
        res.status(503).send({
            error: 'Error while getting teachers',
            status: false
        });
    });
});
//batches where teacher belong
route.get('/:id/batches', function (req, res) {
    if (!courseUrlValidators_1.courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid teacher id',
            status: false
        });
    }
    var tId = parseInt(req.params.id);
    db_1._Teacher.findOne({
        where: {
            id: tId
        }
    }).then(function (teacher) {
        if (teacher) {
            db_1._Lecture.findAll({
                where: {
                    teacherId: teacher.id
                }
            }).then(function (lectures) {
                var batchIds = [];
                for (var _i = 0, lectures_1 = lectures; _i < lectures_1.length; _i++) {
                    var lecture = lectures_1[_i];
                    batchIds.push(lecture.batchId);
                }
                db_1._Batch.findAll({
                    where: {
                        id: { $in: batchIds }
                    }
                }).then(function (batches) {
                    res.status(200).send({
                        batch: batches,
                        status: true
                    });
                }).catch((function (err) {
                    res.status(503).send({
                        error: 'Error getting batches',
                        status: false
                    });
                }));
            }).catch(function (err) {
                res.status(503).send({
                    error: 'Error getting lectures',
                    status: false
                });
            });
        }
        else {
            res.status(403).send({
                error: 'No teacher found'
            });
        }
    }).catch(function (err) {
        res.status(503).send({
            error: 'Error getting teacher',
            status: false
        });
    });
});
//delete teacher record with the respective id
route.delete('/:id', function (req, res) {
    if (!courseUrlValidators_1.courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid teacher id',
            status: false
        });
    }
    var teacherId = parseInt(req.params.id);
    db_1._Teacher.destroy({
        where: {
            id: teacherId
        }
    }).then(function (teacherId) {
        res.status(200).send({
            deletedRows: teacherId,
            status: true,
            message: 'deleted successfully'
        });
    }).catch(function (err) {
        res.status(503).send({
            error: 'Error deleting the teacher',
            status: false
        });
    });
});
//updating name of the teacher with the corresponding teacher id
route.put('/:id', function (req, res) {
    var body = req.body;
    if (!courseUrlValidators_1.courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid teacher id',
            status: false
        });
    }
    var teacherId = parseInt(req.params.id);
    if (!courseUrlValidators_1.courseNameValidator(body.teacherName)) {
        return res.status(403).send({
            error: 'Teacher Name cant be undefined or empty',
            status: false
        });
    }
    var teacherName = body.teacherName;
    db_1._Teacher.findOne({
        where: {
            id: teacherId
        }
    }).then(function (teacher) {
        teacher.set('name', teacherName);
        teacher.save().then(function (updatedTeacher) {
            res.status(200).send({
                teacher: updatedTeacher,
                status: true
            });
        }).catch(function (err) {
            res.status(503).send({
                error: 'Error updating teacher"s info',
                status: false
            });
        });
    }).catch(function (err) {
        res.status(503).send({
            error: 'Error while getting teachers',
            status: false
        });
    });
});
exports.default = route;
