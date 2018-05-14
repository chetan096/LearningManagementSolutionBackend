/// <reference types="sequelize" />
import Sequelize from 'sequelize';
import { ICourse } from './models/course';
import { IBatch } from './models/batch';
import { ILecture } from './models/lecture';
import { IStudent } from './models/student';
import { ITeacher } from './models/teacher';
import { ISubject } from './models/subject';
declare const db: Sequelize.Sequelize;
export declare const _Course: Sequelize.Model<ICourse, any>;
export declare const _Batch: Sequelize.Model<IBatch, any>;
export declare const _Lecture: Sequelize.Model<ILecture, any>;
export declare const _Subject: Sequelize.Model<ISubject, any>;
export declare const _Student: Sequelize.Model<IStudent, any>;
export declare const _Teacher: Sequelize.Model<ITeacher, any>;
export declare const StudentBatch: Sequelize.Model<{}, {}>;
export default db;
