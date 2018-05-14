import { Request, Router, Response } from 'express';
import { _Student, _Batch, StudentBatch, _Course } from '../../db'
import { courseNameValidator, courseIdValidator } from '../../validators/courseUrlValidators';
import { IRequestBody } from '../../dto/requestBody';
import { IStudent } from '../../models/student';
const route: Router = Router({ mergeParams: true });

//will get all students
route.get('/', (req: Request, res: Response) => {
    _Student.findAll().then((students: IStudent[]) => res.status(200).send({
        students: students,
        status: true
    })).catch((err: Error) => {
        res.status(503).send({
            error: 'Error while getting students',
            status: false
        })
    })
})

//add student to the db ,pass studentName as the body parameter
route.post('/', (req: Request, res: Response) => {
    const body: IRequestBody = req.body;
    if (!courseNameValidator(req.body.studentName)) {
        return res.status(403).send({
            error: 'Student Name cant be undefined or empty',
            status: false
        })
    }
    let studentName: string = body.studentName;
    _Student.create({
        name: studentName
    }).then((student) => {
        res.status(201).send({
            student: student,
            status: true
        })
    }).catch((err) => {
        res.status(503).send({
            error: 'Error while adding new student',
            status: false
        })
    })
})

//will get student of particular id
route.get('/:id', (req: Request, res: Response) => {
    if (!courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid student id',
            status: false
        })
    }
    const studentId: number = parseInt(req.params.id);
    _Student.findOne({
        where: {
            id: studentId
        }
    }).then((student: any) => res.status(200).send({
        student: student,
        status: true
    })).catch((err: Error) => {
        res.status(503).send({
            error: 'Error while getting students',
            status: false
        })
    })
})

//delete student of corresponding id
route.delete('/:id', (req: Request, res: Response) => {
    if (!courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid student id',
            status: false
        })
    }
    const studentId: number = parseInt(req.params.id);
    _Student.destroy({
        where: {
            id: studentId
        }
    }).then((rows) => {
        res.status(200).send({
            deletedRows: rows,
            status: true,
            message: 'deleted successfully'
        })
    }).catch((err: Error) => {
        res.status(503).send({
            error: 'Error deleting the student',
            status: false
        })
    })
})


//update name of the user with the respective id ,pass student Name in the body parameter
route.put('/:id', (req: Request, res: Response) => {
    const body: IRequestBody = req.body;
    if (!courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid student id',
            status: false
        })
    }
    const studentId: number = parseInt(req.params.id);
    if (!courseNameValidator(body.studentName)) {
        return res.status(403).send({
            error: 'Student Name cant be undefined or empty',
            status: false
        })
    }
    const studentName: string = body.studentName;
    _Student.findOne({
        where: {
            id: studentId
        }
    }).then((student: any) => {
        student.set('name', studentName);
        student.save().then((updatedStudent: IStudent) => {
            res.status(200).send({
                student: updatedStudent,
                status: true
            })
        }).catch((err: Error) => {
            res.status(503).send({
                error: 'Error updating student"s info',
                status: false
            })
        })
    }).catch((err: Error) => {
        res.status(503).send({
            error: 'Error while getting students',
            status: false
        })
    })
})

//get batches of student with the respective id
route.get('/:id/batches', (req: Request, res: Response) => {
    StudentBatch.findAll({
        where: {
            studentId: req.params.id
        },
        include: [{
            model: _Student
        },
        {
            model: _Batch
        }
        ]
    }).then((data) => {
        res.status(200).send({
            data: data,
            status: true
        })
    }).catch((err: Error) => {
        console.log(err)
        res.status(503).send({
            error: 'Error fetching data',
            status: false
        })
    })
})

//add new batch for the student with the respective id
route.post('/:id/batches', (req: Request, res: Response) => {
    const body: IRequestBody = req.body;
    if (!(courseIdValidator(req.params.id) && (courseIdValidator(req.body.batchId)))) {
        return res.status(403).send({
            error: 'Invalid student id or batch Id',
            status: false
        })
    }
    const studentId: number = parseInt(req.params.id)
    const batchId: number = parseInt(body.batchId);
    StudentBatch.create({
        batchId: batchId,
        studentId: studentId
    }).then((data) => {
        res.status(201).send({
            data: data,
            status: true
        })
    }).catch((err: Error) => {
        console.log(err)
        res.status(503).send({
            error: 'Error adding batch ',
            status: false
        })
    })
})

export default route;