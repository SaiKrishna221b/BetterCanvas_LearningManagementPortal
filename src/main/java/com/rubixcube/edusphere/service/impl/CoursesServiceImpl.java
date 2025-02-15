package com.rubixcube.edusphere.service.impl;

import com.rubixcube.edusphere.dao.CoursesDao;
import com.rubixcube.edusphere.model.Courses;
import com.rubixcube.edusphere.service.CoursesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class CoursesServiceImpl implements CoursesService {

    @Autowired
    CoursesDao coursesDao;

    public Courses getCourseByCourseID(long courseID) {
        return coursesDao.findCoursesByCourseID(courseID).orElse(null);
    }

   public List<Courses> getCoursesByCourseID(List<Long> courseIDs) {
        return coursesDao.findAllByCourseIDIn(courseIDs).orElse(null);
   }
}
