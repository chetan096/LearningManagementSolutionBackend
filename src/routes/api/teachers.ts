import {Request,Router,Response} from 'express';
import {_Teacher, _Student, _Subject, _Lecture, _Batch} from '../../db'
import { IStudent } from '../../models/student';
import { IRequestBody } from '../../dto/requestBody';
import { courseNameValidator, courseIdValidator } from '../../validators/courseUrlValidators';
import { ITeacher } from '../../models/teacher';
import { ILecture } from '../../models/lecture';
import { IBatch } from '../../models/batch';
const route:Router=Router();

//get all teachers from the databases including their subject information
route.get('/', (req: Request, res: Response) => {
    _Teacher.findAll({
        include:[_Subject]
    }).then((teachers: ITeacher[]) => res.status(200).send({
        teachers :teachers,
        status: true
    })).catch((err: Error) => {
        res.status(503).send({
            error: 'Error while getting teachers',
            status: false
        })
    })
})

//add new teacher to the db,pass name of the teacher and subjectid in the body parameter
route.post('/', (req: Request, res: Response) => {
    const body: IRequestBody = req.body;
    if (!(courseNameValidator(req.body.teacherName)&&(courseIdValidator(body.subjectId)))) {
        return res.status(403).send({
            error: 'Teacher Name or subjectId cant be undefined or empty',
            status: false
        })
    }
    const teacherName: string = body.teacherName;
    const subjectId:number=parseInt(body.subjectId)

    _Teacher.create({
        name: teacherName,
        subjectId:subjectId
    }).then((teacher) => {
        res.status(201).send({
            teacher:teacher,
            status: true
        })
    }).catch((err) => {
        console.log(err)
        res.status(503).send({
            error: 'Error while adding new teacher',
            status: false
        })
    })
})

//get particular teacher with the passed id
route.get('/:id', (req: Request, res: Response) => {
    if (!courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid teacher id',
            status: false
        })
    }
    const teacherId: number = parseInt(req.params.id);
    _Teacher.findOne({
        where: {
            id: teacherId
        },
        include:[{
            model:_Subject
        }]
    }).then((teacher: any) => res.status(200).send({
        teacher: teacher,
        status: true
    })).catch((err: Error) => {
        res.status(503).send({
            error: 'Error while getting teachers',
            status: false
        })
    })
})

//batches where teacher belong
route.get('/:id/batches', (req: Request, res: Response) => {
    if (!courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid teacher id',
            status: false
        })
    }
  const tId:number=parseInt(req.params.id);
    _Teacher.findOne({
        where:{
            id:tId
        }
    }).then((teacher)=>{
        if(teacher){
            _Lecture.findAll({
                where:{
                    teacherId:teacher.id
                }
            }).then((lectures:any[])=>{
                    let batchIds:number[]=[];
                    for(let lecture of lectures){
                          batchIds.push(lecture.batchId)
                    }
                    _Batch.findAll({
                        where:{
                            id:{$in:batchIds}
                        }
                    }).then((batches:IBatch[])=>{
                           res.status(200).send({
                               batch:batches,
                               status:true
                           })
                    }).catch((err=>{
                        res.status(503).send({
                            error:'Error getting batches',
                            status:false
                        })
                    }))
            }).catch((err:Error)=>{
                res.status(503).send({
                    error:'Error getting lectures',
                    status:false
                })
            })
        }
        else{
            res.status(403).send({
                error:'No teacher found'
            })
        }
    }).catch((err:Error)=>{
        res.status(503).send({
            error:'Error getting teacher',
            status:false
        })
    })

    
})

//delete teacher record with the respective id
route.delete('/:id', (req: Request, res: Response) => {
    if (!courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid teacher id',
            status: false
        })
    }
    const teacherId: number = parseInt(req.params.id);
        _Teacher.destroy({
            where:{
                id:teacherId
            }
        }).then((teacherId)=>{
            res.status(200).send({
                deletedRows: teacherId,
                status: true,
                message:'deleted successfully'
            })
        }).catch((err:Error)=>{
            res.status(503).send({
                error:'Error deleting the teacher',
                status:false
            })
        })   
})


//updating name of the teacher with the corresponding teacher id
route.put('/:id', (req: Request, res: Response) => {
    const body: IRequestBody = req.body;
    if (!courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid teacher id',
            status: false
        })
    }
    const teacherId: number = parseInt(req.params.id);
    if (!courseNameValidator(body.teacherName)) {
        return res.status(403).send({
            error: 'Teacher Name cant be undefined or empty',
            status: false
        })
    }
    const teacherName: string = body.teacherName;
    _Teacher.findOne({
        where: {
            id: teacherId
        }
    }).then((teacher: any) => {
        teacher.set('name', teacherName);
        teacher.save().then((updatedTeacher: ITeacher) => {
            res.status(200).send({
                teacher: updatedTeacher,
                status: true
            })
        }).catch((err: Error) => {
            res.status(503).send({
                error: 'Error updating teacher"s info',
                status: false
            })
        })
    }).catch((err: Error) => {
        res.status(503).send({
            error: 'Error while getting teachers',
            status: false
        })
    })
})


export default route;