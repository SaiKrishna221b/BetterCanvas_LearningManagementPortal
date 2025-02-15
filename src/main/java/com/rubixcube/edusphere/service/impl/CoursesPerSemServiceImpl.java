package com.rubixcube.edusphere.service.impl;


import com.rubixcube.edusphere.dao.CoursesPerSemDao;
import com.rubixcube.edusphere.model.CoursesPerSem;
import com.rubixcube.edusphere.model.Enrollments;
import com.rubixcube.edusphere.model.Semester;
import com.rubixcube.edusphere.service.CoursesPerSemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class CoursesPerSemServiceImpl implements CoursesPerSemService {

    @Autowired
    private CoursesPerSemDao coursesPerSemDao;


    public List<CoursesPerSem> getCoursesByFacultyBySem(String semID, long facultyID) {
        return coursesPerSemDao.findCoursesIdByFacultyBySem(semID, facultyID);
    }

    public CoursesPerSem getCoursePerSemBySemByCourse(String semID, long courseID) {
        return coursesPerSemDao.findCoursesPerSemBySemAndCourse(semID,courseID).orElse(null);
    }

    public CoursesPerSem assignCourseToFaculty(CoursesPerSem coursesPerSem) {
        return coursesPerSemDao.save(coursesPerSem);
    }

    public List<String> getSemIDsByFacultyID(long facultyID) {
        return coursesPerSemDao.findSemIDsByFacultyID(facultyID).orElse(null);
    }

    public String findCourseContentBySem(String semID, long courseID) {
        return coursesPerSemDao.findCourseContentBySem(semID, courseID).orElse(null);
    }

    public CoursesPerSem saveCoursesPerSem(CoursesPerSem coursesPerSem) {
        return  coursesPerSemDao.save(coursesPerSem);
    }

    public List<Long> getFacultiesIdBySem(String semID) {
        return  coursesPerSemDao.getFacultiesIdBySem(semID).orElse(null);
    }


}
