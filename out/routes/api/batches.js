"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var db_1 = require("../../db");
var courseUrlValidators_1 = require("../../validators/courseUrlValidators");
var db_2 = require("../../db");
var lecture_1 = __importDefault(require("./lecture"));
var route = express_1.Router({ mergeParams: true });
route.get('/batches', function (req, res) {
    db_2._Batch.findAll().then(function (data) {
        res.status(200).send({
            batches: data,
            status: true
        });
    }).catch(function (err) {
        console.log(err);
        res.status(503).send({
            error: 'Error while getting course',
            status: false
        });
    });
});
//get all batch from the db
route.get('/', function (req, res) {
    var courseId = req.params.id;
    if (!courseUrlValidators_1.courseIdValidator(courseId)) {
        return res.status(403).send({
            error: 'Invalid course id',
            status: false
        });
    }
    db_1._Course.findOne({
        where: {
            id: courseId
        },
        include: [{
                model: db_2._Batch
            }]
    }).then(function (courses) {
        res.status(200).send({
            courses: courses,
            status: true
        });
    }).catch(function (err) {
        res.status(503).send({
            error: 'Error getting batches',
            status: false
        });
    });
});
//add new batch pass batchname as body parameter
route.post('/', function (req, res) {
    var body = req.body;
    var batchName = body.batchName;
    if (!courseUrlValidators_1.courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid course id',
            status: false
        });
    }
    var courseId = parseInt(req.params.id);
    if (!courseUrlValidators_1.courseNameValidator(batchName)) {
        return res.status(403).send({
            error: 'Batch Name cant be undefined or empty',
            status: false
        });
    }
    db_2._Batch.create({
        name: batchName,
        courseId: courseId
    }).then(function (batch) {
        res.status(201).send({
            batch: batch,
            status: true
        });
    }).catch(function (err) {
        res.status(503).send({
            error: 'Error while creating new batch',
            status: false
        });
    });
});
//get particular batch with the passed batch id
route.get('/:batchId', function (req, res) {
    if (!(courseUrlValidators_1.courseIdValidator(req.params.id) && courseUrlValidators_1.courseIdValidator(req.params.batchId))) {
        return res.status(403).send({
            error: 'Invalid course id or Batch id',
            status: false
        });
    }
    var courseId = parseInt(req.params.id);
    var batchId = parseInt(req.params.batchId);
    db_2._Batch.findOne({
        where: {
            id: batchId,
            courseId: courseId
        },
        include: [{
                model: db_1._Course
            }]
    }).then(function (batch) {
        if (!batch) {
            console.log(batch);
            return res.status(200).send({
                message: "No batch found for the respective course",
                status: false
            });
        }
        else {
            res.status(200).send({
                batch: batch,
                status: true
            });
        }
    }).catch(function (err) {
        console.log(err);
        res.status(503).send({
            error: 'Error while getting course',
            status: false
        });
    });
});
//update batch name of the batch with passed batch id
route.put('/:batchId', function (req, res) {
    if (!(courseUrlValidators_1.courseIdValidator(req.params.id) && courseUrlValidators_1.courseIdValidator(req.params.batchId))) {
        return res.status(403).send({
            error: 'Invalid course id or Batch id',
            status: false
        });
    }
    var courseId = parseInt(req.params.id);
    var batchId = parseInt(req.params.batchId);
    var body = req.body;
    var batchName = body.batchName;
    if (!courseUrlValidators_1.courseNameValidator(batchName)) {
        return res.status(403).send({
            error: 'Batch Name cant be undefined or empty',
            status: false
        });
    }
    db_2._Batch.findOne({
        where: {
            id: batchId,
            courseId: courseId
        }
    }).then(function (batch) {
        if (!batch) {
            console.log(batch);
            return res.status(200).send({
                message: "No batch found for the respective course",
                status: false
            });
        }
        else {
            batch.set('name', batchName);
            batch.save().then(function (batch) { return res.status(200).send(batch); }).catch(function (err) {
                res.status(503).send({
                    error: 'Error while updating batch information'
                });
            });
        }
    }).catch(function (err) {
        console.log(err);
        res.status(503).send({
            error: 'Error while getting course',
            status: false
        });
    });
});
//delete batch with passed batch id
route.delete('/:batchId', function (req, res) {
    if (!(courseUrlValidators_1.courseIdValidator(req.params.batchId) && courseUrlValidators_1.courseIdValidator(req.params.id))) {
        return res.status(403).send({
            error: 'Invalid batch id or course id',
            status: false
        });
    }
    var courseId = parseInt(req.params.id);
    var batchId = parseInt(req.params.batchId);
    db_2._Batch.findOne({
        where: {
            id: batchId,
            courseId: courseId
        }
    }).then(function (batch) {
        if (batch) {
            db_2._Batch.destroy({
                where: {
                    id: batchId
                }
            }).then(function (rows) {
                res.status(200).send({
                    deletedRows: rows,
                    status: true,
                    message: 'deleted successfully'
                });
            }).catch(function (err) {
                res.status(503).send({
                    error: 'Error deleting the batch',
                    status: false
                });
            });
        }
        else {
            res.status(403).send({
                error: 'Cant able to find batch for corresponding course id',
                status: false
            });
        }
    }).catch(function (err) {
        res.status(503).send({
            error: 'Error while deleting batch',
            status: false
        });
    });
});
//get students for batch with the corresponding batch id
route.get('/:batchId/students', function (req, res) {
    if (!(courseUrlValidators_1.courseIdValidator(req.params.id) && courseUrlValidators_1.courseIdValidator(req.params.batchId))) {
        return res.status(403).send({
            error: 'Invalid course id or Batch id',
            status: false
        });
    }
    var courseId = parseInt(req.params.id);
    var batchId = parseInt(req.params.batchId);
    db_2._Batch.findOne({
        where: {
            id: batchId,
            courseId: courseId
        },
        include: [{
                model: db_1._Course
            }]
    }).then(function (batch) {
        if (!batch) {
            console.log(batch);
            return res.status(200).send({
                message: "No batch found for the respective course",
                status: false
            });
        }
        else {
            db_1.StudentBatch.findAll({
                where: {
                    batchId: batchId
                },
                include: [
                    {
                        model: db_1._Student
                    },
                    {
                        model: db_2._Batch
                    }
                ]
            }).then(function (data) {
                // let studentId:number[]=[];
                // for(let item of data){
                //     studentId.push(item.studentId);
                // }
                // _Student.findAll({
                //     where:{
                //         id:{$in:studentId}
                //     }
                // }).then((students:IStudent[])=>{
                //     res.status(200).send({
                //         students:students,
                //         status:true
                //     })
                // }).catch((err:Error)=>{
                //     res.status(503).send({
                //         error:'Error getting students',
                //         status:false
                //     })
                // })
                res.status(200).send({
                    students: data,
                    status: true
                });
            }).catch(function (err) {
                res.status(503).send({
                    error: 'Error getting students',
                    status: false
                });
            });
        }
    }).catch(function (err) {
        console.log(err);
        res.status(503).send({
            error: 'Error while getting course',
            status: false
        });
    });
});
//get all teachers belong to the batch with passed batch id
route.get('/:batchId/teachers', function (req, res) {
    if (!(courseUrlValidators_1.courseIdValidator(req.params.id) && courseUrlValidators_1.courseIdValidator(req.params.batchId))) {
        return res.status(403).send({
            error: 'Invalid course id or Batch id',
            status: false
        });
    }
    var courseId = parseInt(req.params.id);
    var batchId = parseInt(req.params.batchId);
    db_2._Batch.findOne({
        where: {
            id: batchId,
            courseId: courseId
        },
        include: [{
                model: db_1._Course
            }]
    }).then(function (batch) {
        if (!batch) {
            return res.status(200).send({
                message: "No batch found for the respective course",
                status: false
            });
        }
        else {
            db_1._Lecture.findAll({
                where: {
                    batchId: batchId
                }
            }).then(function (data) {
                var teacherIds = [];
                for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                    var item = data_1[_i];
                    teacherIds.push(item.teacherId);
                }
                db_1._Teacher.findAll({
                    where: {
                        id: { $in: teacherIds }
                    }
                }).then(function (teachers) {
                    res.status(200).send({
                        teachers: teachers,
                        status: true
                    });
                }).catch(function (err) {
                    res.status(503).send({
                        error: 'Error getting teachers',
                        status: false
                    });
                });
            }).catch(function (err) {
                res.status(503).send({
                    error: 'Error getting teachers',
                    status: false
                });
            });
        }
    }).catch(function (err) {
        console.log(err);
        res.status(503).send({
            error: 'Error while getting course',
            status: false
        });
    });
});
route.use('/:batchId/lectures', lecture_1.default);
exports.default = route;
