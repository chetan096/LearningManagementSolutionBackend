// file creates tables and make connection with the database
//const Sequelize = require('sequelize')
import Sequelize from 'sequelize'
import {ICourse} from './models/course'
import {IBatch} from './models/batch'
import {ILecture} from './models/lecture'
import {IStudent} from './models/student';
import {ITeacher} from './models/teacher';
import {ISubject} from './models/subject';

const db = new Sequelize('learningmanagementsolution', 'ngrusr', 'ngrpass', {
  dialect: 'mysql',
  host: 'localhost',
  // rest are optional
  port: 3306,
  // it means all the time at least one connection will be maintained if more request comes then at most 5 connection can be created
  pool: {
    max: 5, // max 5 connection
    min: 1, // min 1 connection
    idle: 1000 // create connection after this timeout
  },
  // metadata information regarding queries
  // create custom function if you want to store logs in other file
  logging: console.log
})


export const _Course=db.define<ICourse,any>('courses',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

export const _Batch = db.define<IBatch,any>('batches', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

export const _Lecture = db.define<ILecture,any>('lectures', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

export const _Subject = db.define<ISubject,any>('subjects', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }

})


export const _Student = db.define<IStudent,any>('students', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }

})

export const _Teacher = db.define<ITeacher,any>('teachers', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

export const StudentBatch = db.define('studentbatches', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }
})


//will create a courseid in the batch table
_Course.hasMany(_Batch);
_Batch.belongsTo(_Course);

//will create a courseId in the subject table.
_Course.hasMany(_Subject);
_Subject.belongsTo(_Course);

//will create batchId in the lecture table
_Batch.hasMany(_Lecture);
_Lecture.belongsTo(_Batch);

//will create teacherId in the lecture table
_Lecture.belongsTo(_Teacher);

//will create lectureId in the subject
_Lecture.belongsTo(_Subject);

//will create subjectId in teacher table
_Subject.hasMany(_Teacher);
_Teacher.belongsTo(_Subject);

//many to many relation between student and batch
_Student.belongsToMany(_Batch,{through:StudentBatch});
_Batch.belongsToMany(_Student,{through:StudentBatch}); 

StudentBatch.belongsTo(_Student);
StudentBatch.belongsTo(_Batch);

// make connection with the database and creates tables
db.sync().then(() => console.log('Database synced')).catch((err) => console.log('Error creating database'))

export default db;