import {Request,Router,Response} from 'express';
import {_Subject, _Teacher} from '../../db';
import { ITeacher } from '../../models/teacher';
import { IRequestBody } from '../../dto/requestBody';
import { courseNameValidator, courseIdValidator } from '../../validators/courseUrlValidators';
import { ISubject } from '../../models/subject';
const route:Router=Router();

//get all subjects from the database 
route.get('/', (req: Request, res: Response) => {
    _Subject.findAll().then((subjects: ISubject[]) => res.status(200).send({
        subjects: subjects,
        status: true
    })).catch((err: Error) => {
        res.status(503).send({
            error: 'Error while getting subjects',
            status: false
        })
    })
})

//add new subject ,pass subject name and course id  as the body parameter
route.post('/', (req: Request, res: Response) => {
    const body: IRequestBody = req.body;
    if (!(courseNameValidator(req.body.subjectName)&&(courseIdValidator(body.courseId)))) {
        return res.status(403).send({
            error: 'Subject Name or courseId cant be undefined or empty',
            status: false
        })
    }
    const subjectName: string = body.subjectName;
    const courseId:number=parseInt(body.courseId)

    _Subject.create({
        name: subjectName,
        courseId:courseId
    }).then((subject) => {
        res.status(201).send({
            subject:subject,
            status: true
        })
    }).catch((err) => {
        console.log(err)
        res.status(503).send({
            error: 'Error while adding new subject',
            status: false
        })
    })
})

//get subject information with respective id
route.get('/:id', (req: Request, res: Response) => {
    if (!courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid subject id',
            status: false
        })
    }
    const subjectId: number = parseInt(req.params.id);
    _Subject.findOne({
        where: {
            id: subjectId
        }
    }).then((subject: any) => res.status(200).send({
        subject: subject,
        status: true
    })).catch((err: Error) => {
        res.status(503).send({
            error: 'Error while getting subjects',
            status: false
        })
    })
})

//delete particular subject from the db
route.delete('/:id', (req: Request, res: Response) => {
    if (!courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid subject id',
            status: false
        })
    }
    const subjectId: number = parseInt(req.params.id);
        _Subject.destroy({
            where:{
                id:subjectId
            }
        }).then((rows)=>{
            res.status(200).send({
                deletedRows:rows,
                status: true,
                message:'deleted successfully'
            })
        }).catch((err:Error)=>{
            res.status(503).send({
                error:'Error deleting the subject',
                status:false
            })
        })   
})


//updating name of the subject with the corresponding subject id
route.put('/:id', (req: Request, res: Response) => {
    const body: IRequestBody = req.body;
    if (!courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid subject id',
            status: false
        })
    }
    const subjectId: number = parseInt(req.params.id);
    if (!courseNameValidator(body.subjectName)) {
        return res.status(403).send({
            error: 'Subject Name cant be undefined or empty',
            status: false
        })
    }
    const subjectName: string = body.subjectName;
    _Subject.findOne({
        where: {
            id: subjectId
        }
    }).then((subject: any) => {
        subject.set('name', subjectName);
        subject.save().then((updatedSubject: ISubject) => {
            res.status(200).send({
                subject: updatedSubject,
                status: true
            })
        }).catch((err: Error) => {
            res.status(503).send({
                error: 'Error updating subject"s info',
                status: false
            })
        })
    }).catch((err: Error) => {
        res.status(503).send({
            error: 'Error while getting subjects',
            status: false
        })
    })
})

//get teachers for particular subject
route.get('/:id/teachers',(req:Request,res:Response)=>{
    if (!courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid subject id',
            status: false
        })
    }
    const subjectId: number = parseInt(req.params.id);
    _Subject.findOne({
        where: {
            id: subjectId
        },
        include:[{
            model:_Teacher
        }]
    }).then((subject: any) => res.status(200).send({
        subject: subject,
        status: true
    })).catch((err: Error) => {
        res.status(503).send({
            error: 'Error while getting subjects',
            status: false
        })
    })
})

export default route;


