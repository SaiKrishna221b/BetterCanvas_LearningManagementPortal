package com.rubixcube.edusphere.service;

import com.rubixcube.edusphere.model.Courses;
import com.rubixcube.edusphere.model.Enrollments;

import java.util.List;

public interface CoursesService {
    Courses getCourseByCourseID(long courseID);

    List<Courses> getCoursesByCourseID(List<Long> courseIDs);
}
