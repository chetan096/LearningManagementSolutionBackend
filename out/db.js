"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// file creates tables and make connection with the database
//const Sequelize = require('sequelize')
var sequelize_1 = __importDefault(require("sequelize"));
var db = new sequelize_1.default('learningmanagementsolution', 'ngrusr', 'ngrpass', {
    dialect: 'mysql',
    host: 'localhost',
    // rest are optional
    port: 3306,
    // it means all the time at least one connection will be maintained if more request comes then at most 5 connection can be created
    pool: {
        max: 5,
        min: 1,
        idle: 1000 // create connection after this timeout
    },
    // metadata information regarding queries
    // create custom function if you want to store logs in other file
    logging: console.log
});
exports._Course = db.define('courses', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: sequelize_1.default.STRING,
        allowNull: false
    }
});
exports._Batch = db.define('batches', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: sequelize_1.default.STRING,
        allowNull: false
    }
});
exports._Lecture = db.define('lectures', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: sequelize_1.default.STRING,
        allowNull: false
    }
});
exports._Subject = db.define('subjects', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: sequelize_1.default.STRING,
        allowNull: false
    }
});
exports._Student = db.define('students', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: sequelize_1.default.STRING,
        allowNull: false
    }
});
exports._Teacher = db.define('teachers', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: sequelize_1.default.STRING,
        allowNull: false
    }
});
exports.StudentBatch = db.define('studentbatches', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
});
//will create a courseid in the batch table
exports._Course.hasMany(exports._Batch);
exports._Batch.belongsTo(exports._Course);
//will create a courseId in the subject table.
exports._Course.hasMany(exports._Subject);
exports._Subject.belongsTo(exports._Course);
//will create batchId in the lecture table
exports._Batch.hasMany(exports._Lecture);
exports._Lecture.belongsTo(exports._Batch);
//will create teacherId in the lecture table
exports._Lecture.belongsTo(exports._Teacher);
//will create lectureId in the subject
exports._Lecture.belongsTo(exports._Subject);
//will create subjectId in teacher table
exports._Subject.hasMany(exports._Teacher);
exports._Teacher.belongsTo(exports._Subject);
//many to many relation between student and batch
exports._Student.belongsToMany(exports._Batch, { through: exports.StudentBatch });
exports._Batch.belongsToMany(exports._Student, { through: exports.StudentBatch });
exports.StudentBatch.belongsTo(exports._Student);
exports.StudentBatch.belongsTo(exports._Batch);
// make connection with the database and creates tables
db.sync().then(function () { return console.log('Database synced'); }).catch(function (err) { return console.log('Error creating database'); });
exports.default = db;
