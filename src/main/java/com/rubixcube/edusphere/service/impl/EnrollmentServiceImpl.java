package com.rubixcube.edusphere.service.impl;


import com.rubixcube.edusphere.dao.CoursesPerSemDao;
import com.rubixcube.edusphere.dao.EnrollmentDao;
import com.rubixcube.edusphere.model.Courses;
import com.rubixcube.edusphere.model.CoursesPerSem;
import com.rubixcube.edusphere.model.Enrollments;
import com.rubixcube.edusphere.service.CoursesPerSemService;
import com.rubixcube.edusphere.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class EnrollmentServiceImpl implements EnrollmentService {

    @Autowired
    private EnrollmentDao enrollmentDao;

    public List<Long> getStudentIDsByCourseBySem(long courseID, String semID) {
        return enrollmentDao.getStudentIDsByCourseBySem(courseID,semID).orElse(null);
    }

    public List<Long> getCourseIdsByStudentBySem(String semID, long studentID) {
        return enrollmentDao.findCourseIdsByStudentBySem(semID,studentID).orElse(null);
    }

    public List<List<String>> getStudentDetails(String semID,long courseID){

        return enrollmentDao.findStudentDetails(semID, courseID);
    }
}
