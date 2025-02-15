package com.rubixcube.edusphere.service.impl;


import com.rubixcube.edusphere.dao.FacultyDao;
import com.rubixcube.edusphere.model.Faculty;
import com.rubixcube.edusphere.service.FacultyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacultyServiceImpl implements FacultyService {

    @Autowired
    FacultyDao facultyDao;

    public Faculty getFacultyByFacultyID(long facultyID) {
        return facultyDao.findFacultyByFacultyID(facultyID).orElse(null);
    }

    public List<Faculty> getFacultiesByIDs(List<Long> facultyIDs) {
        return  facultyDao.getFacultiesByIDs(facultyIDs).orElse(null);
    }
}
