export let courseIdValidator =
    function (courseId: any) {
        if (isNaN(courseId) || courseId < 1 || courseId === void (0)) {
            return false;
        }
        return true;
    }

export let courseNameValidator=function(courseName:string){
    if (courseName === void (0) || courseName === '') {
        return false;
    }
    return true;
}