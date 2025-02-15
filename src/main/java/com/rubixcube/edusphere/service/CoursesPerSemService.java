package com.rubixcube.edusphere.service;

import com.rubixcube.edusphere.model.CoursesPerSem;

import com.rubixcube.edusphere.model.Semester;

import java.util.List;
import java.util.Optional;

public interface CoursesPerSemService {

    List<CoursesPerSem> getCoursesByFacultyBySem( String semID,long facultyID);

    CoursesPerSem assignCourseToFaculty(CoursesPerSem coursesPerSem);

    CoursesPerSem getCoursePerSemBySemByCourse(String semID, long courseID);

    List<String> getSemIDsByFacultyID(long facultyID);


    String findCourseContentBySem(String semID, long courseID);

    CoursesPerSem saveCoursesPerSem(CoursesPerSem coursesPerSem);

    List<Long> getFacultiesIdBySem( String semID);

}
