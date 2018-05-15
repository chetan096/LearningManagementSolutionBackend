import { Request, Router, Response } from 'express';
import { IRequestBody } from '../../dto/requestBody'
import { _Lecture, _Subject, _Teacher, _Batch, _Course } from '../../db';
import { ILecture } from '../../models/lecture';
import { courseNameValidator, courseIdValidator } from '../../validators/courseUrlValidators';
import { IBatch } from '../../models/batch';
const route: Router = Router({ mergeParams: true });

//get all lectures from the db
route.get('/', (req: Request, res: Response) => {
    if (!(courseIdValidator(req.params.id) && courseIdValidator(req.params.batchId))) {
        return res.status(403).send({
            error: 'Course  or Batch id is invalid ',
            status: false
        })
    }
    const courseId: number = parseInt(req.params.id);
    const batchId: number = parseInt(req.params.batchId);

    _Batch.findOne({
        where: {
            id: batchId,
            courseId: courseId
        }
    }).then((batch) => {
        if (batch) {
            console.log("got batch")
            _Lecture.findAll({
                where: {
                    batchId: batchId
                },
                include: [
                    {
                        model: _Subject
                    },
                    {
                        model: _Teacher
                    },
                    {
                        model: _Batch
                    }
                ]
            }).then((lectures: ILecture[]) => res.status(200).send({
                lecture: lectures,
                status: true
            })).catch((err: Error) => {
                res.status(503).send({
                    error: 'Error while getting lectures',
                    status: false
                })
            })
        }
        else {
            res.status(403).send({
                error: 'No batch found for corresponding  course id',
                status: false
            })
        }
    }).catch((err: Error) => {
        res.status(503).send({
            error: 'error while fetching lectures',
            status: false

        })
    })


})

//teacher id and subject id,lecturename as body parameter 
route.post('/', (req: Request, res: Response) => {
    const body: IRequestBody = req.body;
    console.log(req.body.teacherId)
    if (!(courseNameValidator(req.body.lectureName) && courseIdValidator(req.params.id) && courseIdValidator(req.params.batchId) &&
        courseIdValidator(body.teacherId) && courseIdValidator(body.subjectId))) {
        return res.status(403).send({
            error: 'Error while adding lecture',
            status: false
        })
    }

    const lectureName: string = body.lectureName;
    const courseId: number = parseInt(req.params.id);
    const batchId: number = parseInt(req.params.batchId);
    const teacherId: number = parseInt(body.teacherId);
    const subjectId: number = parseInt(body.subjectId);

    //if there is a batch then you can add lecture otherwise not
    _Batch.findOne({
        where: {
            id: batchId,
            courseId: courseId
        }
    }).then((batch: any) => {
        if (batch) {
            _Teacher.findOne({
                where: {
                    subjectId: subjectId,
                    id:teacherId
                }
            }).then((data) => {
                if (!data) {
                    res.status(403).send({
                        error: 'No teacher found for subject id ' + subjectId,
                        status: false
                    })
                }
                else {
                    _Lecture.create({
                        name: lectureName,
                        batchId: batchId,
                        teacherId: teacherId,
                        subjectId: subjectId

                    }).then((lecture) => {
                        res.status(201).send({
                            lecture: lecture,
                            status: true
                        })
                    }).catch((err) => {
                        console.log(err)
                        res.status(503).send({
                            error: 'Error while adding new lecture',
                            status: false
                        })
                    })
                }
            }).catch((err) => {
                console.log(err)
                res.status(503).send({
                    error: 'Error while adding new lecture',
                    status: false
                })

            })
        }
        else {
            res.status(403).send({
                error: 'No batch found for corresponding course id',
                status: false
            })
        }
    })
        .catch((err: Error) => {
            res.status(503).send({
                error: 'No batch found for corresponding course id',
                status: false
            })
        })
})

//get lecture of corresponding lecture id
route.get('/:lectureId', (req: Request, res: Response) => {
    if (!(courseIdValidator(req.params.id) && courseIdValidator(req.params.batchId) && courseIdValidator(req.params.lectureId))) {
        return res.status(403).send({
            error: 'Course  or Batch id is invalid ',
            status: false
        })
    }
    const courseId: number = parseInt(req.params.id);
    const batchId: number = parseInt(req.params.batchId);
    const lectureId: number = parseInt(req.params.lectureId)

    _Batch.findOne({
        where: {
            id: batchId,
            courseId: courseId
        }
    }).then((batch) => {
        if (batch) {
            _Lecture.findOne({
                where: {
                    id: lectureId
                },
                include: [
                    {
                        model: _Subject
                    },
                    {
                        model: _Teacher
                    },
                    {
                        model: _Batch,
                        include: [_Course]
                    }
                ]
            }).then((lecture: any) => {
                if (lecture) {
                    res.status(200).send({
                        lecture: lecture,
                        status: true
                    })
                }
                else {
                    res.status(503).send({
                        error: 'No lecture for corressponding lecture id'
                    })
                }
            }
            ).catch((err: Error) => {
                res.status(503).send({
                    error: 'Error while getting lectures',
                    status: false
                })
            })
        }
        else {
            res.status(200).send({
                error: 'No batch found for corresponding  course id',
                status: false
            })
        }
    }).catch((err: Error) => {
        res.status(503).send({
            error: 'error while fetching lectures',
            status: false

        })
    })


})

//delete lecture with the id passed in the url from the lecture table in the db
route.delete('/:lectureId', (req: Request, res: Response) => {
    if (!(courseIdValidator(req.params.id) && courseIdValidator(req.params.batchId) && courseIdValidator(req.params.lectureId))) {
        return res.status(403).send({
            error: 'Course  or Batch id is invalid ',
            status: false
        })
    }
    const courseId: number = parseInt(req.params.id);
    const batchId: number = parseInt(req.params.batchId);
    const lectureId: number = parseInt(req.params.lectureId);

    _Batch.findOne({
        where: {
            id: batchId,
            courseId: courseId
        }
    }).then((batch) => {
        if (batch) {
            _Lecture.destroy({
                where: {
                    id: lectureId
                }
            }).then((rows) => {
                res.status(200).send({
                    deletedRows: rows,
                    status: true,
                    message: 'deleted successfully'
                })
            }).catch((err: Error) => {
                res.status(503).send({
                    error: 'Error deleting the lecture',
                    status: false
                })
            })
        }
        else {
            res.status(403).send({
                error: 'No batch found for corresponding  course id',
                status: false
            })
        }
    }).catch((err: Error) => {
        res.status(503).send({
            error: 'error while fetching lectures',
            status: false
        })
    })

})

//update lecture name of the lecture with the passed id in the url
route.put('/:lectureId', (req: Request, res: Response) => {
    if (!(courseIdValidator(req.params.id) && courseIdValidator(req.params.batchId) && courseNameValidator(req.body.lectureName) &&
        courseIdValidator(req.params.lectureId))) {
        return res.status(403).send({
            error: 'Course  or Batch id is invalid ',
            status: false
        })
    }
    const courseId: number = parseInt(req.params.id);
    const batchId: number = parseInt(req.params.batchId);
    const lectureId: number = parseInt(req.params.lectureId);
    const lectureName: string = req.body.lectureName;

    _Batch.findOne({
        where: {
            id: batchId,
            courseId: courseId
        }
    }).then((batch: any) => {
        if (batch) {
            _Lecture.find({
                where: {
                    id: lectureId
                }
            }).then((lecture: any) => {
                lecture.update({
                    name: lectureName
                }).then((updatedLecture: any) => {
                    res.status(200).send({
                        lecture: updatedLecture,
                        status: true,
                        message: 'updated successfully'
                    })
                }).catch((err: Error) => {
                    res.status(503).send({
                        error: 'Error updating the lecture',
                        status: false
                    })
                })

            }).catch((err: Error) => {
                res.status(503).send({
                    error: 'Error updating the lecture',
                    status: false
                })
            })
        }
        else {
            res.status(200).send({
                error: 'No batch found for corresponding  course id',
                status: false
            })
        }
    }).catch((err: Error) => {
        console.log(err)
        res.status(503).send({
            error: 'error while fetching lectures',
            status: false
        })
    })
})



export default route;


