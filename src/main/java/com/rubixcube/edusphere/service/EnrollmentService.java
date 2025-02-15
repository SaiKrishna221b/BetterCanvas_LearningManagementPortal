package com.rubixcube.edusphere.service;

import com.rubixcube.edusphere.model.CoursesPerSem;
import com.rubixcube.edusphere.model.Enrollments;

import java.util.List;

import org.springframework.stereotype.Service;

public interface EnrollmentService {
    List<Long> getStudentIDsByCourseBySem(long courseID, String semID);
    List<Long> getCourseIdsByStudentBySem(String semID, long studentID);

    List<List<String>>getStudentDetails(String semID,long courseID);

}
