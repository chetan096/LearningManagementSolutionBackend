"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var db_1 = require("../../db");
var courseUrlValidators_1 = require("../../validators/courseUrlValidators");
var route = express_1.Router({ mergeParams: true });
//get all lectures from the db
route.get('/', function (req, res) {
    if (!(courseUrlValidators_1.courseIdValidator(req.params.id) && courseUrlValidators_1.courseIdValidator(req.params.batchId))) {
        return res.status(403).send({
            error: 'Course  or Batch id is invalid ',
            status: false
        });
    }
    var courseId = parseInt(req.params.id);
    var batchId = parseInt(req.params.batchId);
    db_1._Batch.findOne({
        where: {
            id: batchId,
            courseId: courseId
        }
    }).then(function (batch) {
        if (batch) {
            console.log("got batch");
            db_1._Lecture.findAll({
                where: {
                    batchId: batchId
                },
                include: [
                    {
                        model: db_1._Subject
                    },
                    {
                        model: db_1._Teacher
                    },
                    {
                        model: db_1._Batch
                    }
                ]
            }).then(function (lectures) { return res.status(200).send({
                lecture: lectures,
                status: true
            }); }).catch(function (err) {
                res.status(503).send({
                    error: 'Error while getting lectures',
                    status: false
                });
            });
        }
        else {
            res.status(403).send({
                error: 'No batch found for corresponding  course id',
                status: false
            });
        }
    }).catch(function (err) {
        res.status(503).send({
            error: 'error while fetching lectures',
            status: false
        });
    });
});
//teacher id and subject id,lecturename as body parameter 
route.post('/', function (req, res) {
    var body = req.body;
    console.log(req.body.teacherId);
    if (!(courseUrlValidators_1.courseNameValidator(req.body.lectureName) && courseUrlValidators_1.courseIdValidator(req.params.id) && courseUrlValidators_1.courseIdValidator(req.params.batchId) &&
        courseUrlValidators_1.courseIdValidator(body.teacherId) && courseUrlValidators_1.courseIdValidator(body.subjectId))) {
        return res.status(403).send({
            error: 'Error while adding lecture',
            status: false
        });
    }
    var lectureName = body.lectureName;
    var courseId = parseInt(req.params.id);
    var batchId = parseInt(req.params.batchId);
    var teacherId = parseInt(body.teacherId);
    var subjectId = parseInt(body.subjectId);
    //if there is a batch then you can add lecture otherwise not
    db_1._Batch.findOne({
        where: {
            id: batchId,
            courseId: courseId
        }
    }).then(function (batch) {
        if (batch) {
            db_1._Teacher.findOne({
                where: {
                    subjectId: subjectId,
                    id: teacherId
                }
            }).then(function (data) {
                if (!data) {
                    res.status(403).send({
                        error: 'No teacher found for subject id ' + subjectId,
                        status: false
                    });
                }
                else {
                    db_1._Lecture.create({
                        name: lectureName,
                        batchId: batchId,
                        teacherId: teacherId,
                        subjectId: subjectId
                    }).then(function (lecture) {
                        res.status(201).send({
                            lecture: lecture,
                            status: true
                        });
                    }).catch(function (err) {
                        console.log(err);
                        res.status(503).send({
                            error: 'Error while adding new lecture',
                            status: false
                        });
                    });
                }
            }).catch(function (err) {
                console.log(err);
                res.status(503).send({
                    error: 'Error while adding new lecture',
                    status: false
                });
            });
        }
        else {
            res.status(403).send({
                error: 'No batch found for corresponding course id',
                status: false
            });
        }
    })
        .catch(function (err) {
        res.status(503).send({
            error: 'No batch found for corresponding course id',
            status: false
        });
    });
});
//get lecture of corresponding lecture id
route.get('/:lectureId', function (req, res) {
    if (!(courseUrlValidators_1.courseIdValidator(req.params.id) && courseUrlValidators_1.courseIdValidator(req.params.batchId) && courseUrlValidators_1.courseIdValidator(req.params.lectureId))) {
        return res.status(403).send({
            error: 'Course  or Batch id is invalid ',
            status: false
        });
    }
    var courseId = parseInt(req.params.id);
    var batchId = parseInt(req.params.batchId);
    var lectureId = parseInt(req.params.lectureId);
    db_1._Batch.findOne({
        where: {
            id: batchId,
            courseId: courseId
        }
    }).then(function (batch) {
        if (batch) {
            db_1._Lecture.findOne({
                where: {
                    id: lectureId
                },
                include: [
                    {
                        model: db_1._Subject
                    },
                    {
                        model: db_1._Teacher
                    },
                    {
                        model: db_1._Batch,
                        include: [db_1._Course]
                    }
                ]
            }).then(function (lecture) {
                if (lecture) {
                    res.status(200).send({
                        lecture: lecture,
                        status: true
                    });
                }
                else {
                    res.status(503).send({
                        error: 'No lecture for corressponding lecture id'
                    });
                }
            }).catch(function (err) {
                res.status(503).send({
                    error: 'Error while getting lectures',
                    status: false
                });
            });
        }
        else {
            res.status(200).send({
                error: 'No batch found for corresponding  course id',
                status: false
            });
        }
    }).catch(function (err) {
        res.status(503).send({
            error: 'error while fetching lectures',
            status: false
        });
    });
});
//delete lecture with the id passed in the url from the lecture table in the db
route.delete('/:lectureId', function (req, res) {
    if (!(courseUrlValidators_1.courseIdValidator(req.params.id) && courseUrlValidators_1.courseIdValidator(req.params.batchId) && courseUrlValidators_1.courseIdValidator(req.params.lectureId))) {
        return res.status(403).send({
            error: 'Course  or Batch id is invalid ',
            status: false
        });
    }
    var courseId = parseInt(req.params.id);
    var batchId = parseInt(req.params.batchId);
    var lectureId = parseInt(req.params.lectureId);
    db_1._Batch.findOne({
        where: {
            id: batchId,
            courseId: courseId
        }
    }).then(function (batch) {
        if (batch) {
            db_1._Lecture.destroy({
                where: {
                    id: lectureId
                }
            }).then(function (rows) {
                res.status(200).send({
                    deletedRows: rows,
                    status: true,
                    message: 'deleted successfully'
                });
            }).catch(function (err) {
                res.status(503).send({
                    error: 'Error deleting the lecture',
                    status: false
                });
            });
        }
        else {
            res.status(403).send({
                error: 'No batch found for corresponding  course id',
                status: false
            });
        }
    }).catch(function (err) {
        res.status(503).send({
            error: 'error while fetching lectures',
            status: false
        });
    });
});
//update lecture name of the lecture with the passed id in the url
route.put('/:lectureId', function (req, res) {
    if (!(courseUrlValidators_1.courseIdValidator(req.params.id) && courseUrlValidators_1.courseIdValidator(req.params.batchId) && courseUrlValidators_1.courseNameValidator(req.body.lectureName) &&
        courseUrlValidators_1.courseIdValidator(req.params.lectureId))) {
        return res.status(403).send({
            error: 'Course  or Batch id is invalid ',
            status: false
        });
    }
    var courseId = parseInt(req.params.id);
    var batchId = parseInt(req.params.batchId);
    var lectureId = parseInt(req.params.lectureId);
    var lectureName = req.body.lectureName;
    db_1._Batch.findOne({
        where: {
            id: batchId,
            courseId: courseId
        }
    }).then(function (batch) {
        if (batch) {
            db_1._Lecture.find({
                where: {
                    id: lectureId
                }
            }).then(function (lecture) {
                lecture.update({
                    name: lectureName
                }).then(function (updatedLecture) {
                    res.status(200).send({
                        lecture: updatedLecture,
                        status: true,
                        message: 'updated successfully'
                    });
                }).catch(function (err) {
                    res.status(503).send({
                        error: 'Error updating the lecture',
                        status: false
                    });
                });
            }).catch(function (err) {
                res.status(503).send({
                    error: 'Error updating the lecture',
                    status: false
                });
            });
        }
        else {
            res.status(200).send({
                error: 'No batch found for corresponding  course id',
                status: false
            });
        }
    }).catch(function (err) {
        console.log(err);
        res.status(503).send({
            error: 'error while fetching lectures',
            status: false
        });
    });
});
exports.default = route;
