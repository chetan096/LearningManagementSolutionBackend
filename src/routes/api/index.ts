//const route=require('express').Router();
import {Request,Router} from 'express';
import courseRoute from './courses';
import studentRoute from './students'
import subjectRoute from './subjects'
import teacherRoute from './teachers'
import batchRoute from './batches'

const route:Router=Router();

const routes={
   courseRoute,studentRoute,subjectRoute,teacherRoute,batchRoute
}

//will mount courses  on this url
route.use('/courses',routes.courseRoute);
//will mount teachers on this url
route.use('/teachers',routes.teacherRoute);
//will mount students  on this url
route.use('/students',routes.studentRoute);
//will mount subjects  on this url
route.use('/subjects',routes.subjectRoute);

route.use('/',routes.batchRoute)

//export this route
export default route