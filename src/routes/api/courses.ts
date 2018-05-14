import { Request, Router, Response } from 'express';
import { _Course } from '../../db'
import { ICourse } from '../../models/course'
import { IRequestBody } from '../../dto/requestBody'
import batchRoute from './batches';
import {courseIdValidator, courseNameValidator} from '../../validators/courseUrlValidators'
const route: Router = Router();

//get all courses from the database
route.get('/', (req: Request, res: Response) => {
    _Course.findAll().then((courses: ICourse[]) => res.status(200).send({
        courses: courses,
        status: true
    })).catch((err: Error) => {
        res.status(503).send({
            error: 'Error in getting courses',
            status: false
        })
    })
})

//get particular course with the respective id from the database
route.get('/:id',(req:Request,res:Response)=>{

   let courseId = req.params.id;
   
    if(courseIdValidator(courseId)==false){
         return res.status(403).send({
             error:'Invalid course id',
             status:false
         })
    }

    _Course.find({
        where: {
            id: courseId
        }
    }).then((course: any) => {
           res.status(200).send({
               course:course,
               status:true
           })
        })
        .catch((err: Error) => {
            res.status(503).send({
                error: 'Error getting course ',
                status: false
            })
        })

})

//adding new course to the db, pass courseName as body parameter
route.post('/', (req: Request, res: Response) => {
    const body: IRequestBody = req.body;
    let courseName: string = body.courseName;
    if (courseNameValidator(courseName)==false) {
        return res.status(403).send({
            error: 'Course Name cant be undefined or empty',
            status: false
        })
    }
    _Course.create({
        name: courseName
    }).then((course: ICourse) => {
        res.status(200).send({
            status: true,
            course: course
        })
    }).catch((err: Error) => {
        console.log(err);
        res.status(503).send({
            error: 'Error while adding course',
            status: false
        })
    })

})

//update coursename of course with passed id,pass new course name as body parameter
route.put('/:id', (req: Request, res: Response) => {
    let courseId:number = req.params.id;
    if(!courseIdValidator(courseId)){
        return res.status(403).send({
            error:'Invalid course id',
            status:false
        })
   }
    let body: IRequestBody = req.body;
    let courseName:string = body.courseName;
    if (!courseNameValidator(courseName)) {
        return res.status(403).send({
            error: 'Course Name cant be undefined or empty',
            status: false
        })
    }
    _Course.find({
        where: {
            id: courseId
        }
    }).then((course: any) => {
        course.set('name', courseName);
        course.save().then((course: ICourse) => {
            res.status(200).send({
                course: course,
                status: true
            })
        }).catch((err: Error) => {
            res.status(503).send({
                error: 'Error while updating course name',
                status: false
            })
        })
    })
        .catch((err: Error) => {
            res.status(503).send({
                error: 'Error updating course name',
                status: false
            })
        })

})

//delete course with the corresponding id
route.delete('/:id', (req: Request, res: Response) => {
    if (!courseIdValidator(req.params.id)) {
        return res.status(403).send({
            error: 'Invalid course id',
            status: false
        })
    }
    const courseId: number = parseInt(req.params.id);
        _Course.destroy({
            where:{
                id:courseId
            }
        }).then((rows)=>{
            res.status(200).send({
                deletedRows:rows,
                status: true,
                message:'deleted successfully'
            })
        }).catch((err:Error)=>{
            res.status(503).send({
                error:'Error deleting the student',
                status:false
            })
        })   
})



//if not matched with any above then let it fallback to this url that will use batch route further
route.use('/:id/batches',batchRoute)

export default route;