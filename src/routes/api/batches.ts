import { Request, Router, Response } from 'express';
import { _Course, StudentBatch, _Student, _Lecture, _Teacher } from '../../db'
import { ICourse } from '../../models/course'
import { IRequestBody } from '../../dto/requestBody'
import { courseIdValidator, courseNameValidator } from '../../validators/courseUrlValidators'
import { _Batch } from '../../db'
import { REPLServer } from 'repl';
import { IBatch } from '../../models/batch';
import lectureRoute from './lecture';
import { IStudent } from '../../models/student';
import { ITeacher } from '../../models/teacher';

const route: Router = Router({ mergeParams: true });

route.get('/batches',(req:Request,res:Response)=>{
    _Batch.findAll().then((data:IBatch[])=>{
            res.status(200).send({
                batches:data,
                status:true
            })
    }).catch((err: Error) => {
       console.log(err)
       res.status(503).send({
           error: 'Error while getting course',
           status: false
       })
   })
})

//get all batch from the db
route.get('/', (req: Request, res: Response) => {
    let courseId: number = req.params.id;
    if (!courseIdValidator(courseId)) {
        return res.status(403).send({
            error: 'Invalid course id',
            status: false
        })
    }
    _Course.findOne({
        where: {
            id: courseId
        },
        include: [{
            model: _Batch
        }]
    }).then((courses: any) => {
        res.status(200).send({
            courses: courses,
            status: true
        })
    }).catch((err: Error) => {
        res.status(503).send({
            error: 'Error getting batches',
            status: false
        })
    })

})


//add new batch pass batchname as body parameter
route.post('/', (req: Request, res: Response) => {

    const body: IRequestBody = req.body;
    const batchName: string = body.batchName;
    if (!courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid course id',
            status: false
        })
    }
    const courseId: number = parseInt(req.params.id);
    if (!courseNameValidator(batchName)) {
        return res.status(403).send({
            error: 'Batch Name cant be undefined or empty',
            status: false
        })
    }

    _Batch.create({
        name: batchName,
        courseId: courseId
    }).then((batch) => {
        res.status(201).send({
            batch: batch,
            status: true
        })
    }).catch((err: Error) => {
        res.status(503).send({
            error: 'Error while creating new batch',
            status: false
        })
    })
})

//get particular batch with the passed batch id
route.get('/:batchId', (req: Request, res: Response) => {


    if (!(courseIdValidator(req.params.id) && courseIdValidator(req.params.batchId))) {
        return res.status(403).send({
            error: 'Invalid course id or Batch id',
            status: false
        })
    }
    const courseId: number = parseInt(req.params.id);
    const batchId: number = parseInt(req.params.batchId);


    _Batch.findOne({
        where: {
            id: batchId,
            courseId: courseId
        },
        include: [{
            model: _Course
        }]
    }).then((batch: any) => {
        if (!batch) {
            console.log(batch);
            return res.status(200).send({
                message: "No batch found for the respective course",
                status: false
            })
        }
        else {
            res.status(200).send({
                batch: batch,
                status: true
            })
        }
    }).catch((err: Error) => {
        console.log(err)
        res.status(503).send({
            error: 'Error while getting course',
            status: false
        })
    })

})

//update batch name of the batch with passed batch id
route.put('/:batchId', (req: Request, res: Response) => {
    if (!(courseIdValidator(req.params.id) && courseIdValidator(req.params.batchId))) {
        return res.status(403).send({
            error: 'Invalid course id or Batch id',
            status: false
        })
    }
    const courseId: number = parseInt(req.params.id);
    const batchId: number = parseInt(req.params.batchId);
    const body: IRequestBody = req.body;
    const batchName: string = body.batchName;

    if (!courseNameValidator(batchName)) {
        return res.status(403).send({
            error: 'Batch Name cant be undefined or empty',
            status: false
        })
    }

    _Batch.findOne({
        where: {
            id: batchId,
            courseId: courseId
        }
    }).then((batch: any) => {
        if (!batch) {
            console.log(batch);
            return res.status(200).send({
                message: "No batch found for the respective course",
                status: false
            })
        }
        else {
            batch.set('name', batchName);
            batch.save().then((batch: IBatch) => res.status(200).send(batch)).catch((err: Error) => {
                res.status(503).send({
                    error: 'Error while updating batch information'
                })
            })
        }
    }).catch((err: Error) => {
        console.log(err)
        res.status(503).send({
            error: 'Error while getting course',
            status: false
        })
    })

})

//delete batch with passed batch id
route.delete('/:batchId', (req: Request, res: Response) => {
    if (!(courseIdValidator(req.params.batchId) && courseIdValidator(req.params.id))) {
        return res.status(403).send({
            error: 'Invalid batch id or course id',
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
            _Batch.destroy({
                where: {
                    id: batchId
                }
            }).then((rows) => {
                res.status(200).send({
                    deletedRows: rows,
                    status: true,
                    message: 'deleted successfully'
                })
            }).catch((err: Error) => {
                res.status(503).send({
                    error: 'Error deleting the batch',
                    status: false
                })
            })
        }
        else {
            res.status(403).send({
                error: 'Cant able to find batch for corresponding course id',
                status: false
            })
        }
    }).catch((err: Error) => {
        res.status(503).send({
            error: 'Error while deleting batch',
            status: false
        })
    })
})

//get students for batch with the corresponding batch id
route.get('/:batchId/students', (req: Request, res: Response) => {

    if (!(courseIdValidator(req.params.id) && courseIdValidator(req.params.batchId))) {
        return res.status(403).send({
            error: 'Invalid course id or Batch id',
            status: false
        })
    }
    const courseId: number = parseInt(req.params.id);
    const batchId: number = parseInt(req.params.batchId);
    _Batch.findOne({
        where: {
            id: batchId,
            courseId: courseId
        },
        include: [{
            model: _Course
        }]
    }).then((batch: any) => {
        if (!batch) {
            console.log(batch);
            return res.status(200).send({
                message: "No batch found for the respective course",
                status: false
            })
        }
        else {
              StudentBatch.findAll({
                  where:{
                      batchId:batchId
                  },
                  include:[
                  {
                      model:_Student
                  },
                  {
                      model:_Batch
                  }
                ]

              }).then((data:any)=>{
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
                        students:data,
                        status:true
                    })
              }).catch((err:Error)=>{
                  res.status(503).send({
                      error:'Error getting students',
                      status:false
                  })
              })      
           }
    }).catch((err: Error) => {
        console.log(err)
        res.status(503).send({
            error: 'Error while getting course',
            status: false
        })
    })

})

//get all teachers belong to the batch with passed batch id
route.get('/:batchId/teachers', (req: Request, res: Response) => {

    if (!(courseIdValidator(req.params.id) && courseIdValidator(req.params.batchId))) {
        return res.status(403).send({
            error: 'Invalid course id or Batch id',
            status: false
        })
    }
    const courseId: number = parseInt(req.params.id);
    const batchId: number = parseInt(req.params.batchId);
    _Batch.findOne({
        where: {
            id: batchId,
            courseId: courseId
        },
        include: [{
            model: _Course
        }]
    }).then((batch: any) => {
        if (!batch) {
            return res.status(200).send({
                message: "No batch found for the respective course",
                status: false
            })
        }
        else {
              _Lecture.findAll({
                  where:{
                      batchId:batchId
                  }
              }).then((data:any)=>{
                    let teacherIds:number[]=[];
                    for(let item of data){
                        teacherIds.push(item.teacherId);
                    }
                    _Teacher.findAll({
                        where:{
                            id:{$in:teacherIds}
                        }
                    }).then((teachers:ITeacher[])=>{
                        res.status(200).send({
                            teachers:teachers,
                            status:true
                        })
                    }).catch((err:Error)=>{
                        res.status(503).send({
                            error:'Error getting teachers',
                            status:false
                        })
                    })
              }).catch((err:Error)=>{
                  res.status(503).send({
                      error:'Error getting teachers',
                      status:false
                  })
              })      
           }
    }).catch((err: Error) => {
        console.log(err)
        res.status(503).send({
            error: 'Error while getting course',
            status: false
        })
    })

})



route.use('/:batchId/lectures', lectureRoute)

export default route;
