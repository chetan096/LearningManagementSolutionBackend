"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseIdValidator = function (courseId) {
    if (isNaN(courseId) || courseId < 1 || courseId === void (0)) {
        return false;
    }
    return true;
};
exports.courseNameValidator = function (courseName) {
    if (courseName === void (0) || courseName === '') {
        return false;
    }
    return true;
};
