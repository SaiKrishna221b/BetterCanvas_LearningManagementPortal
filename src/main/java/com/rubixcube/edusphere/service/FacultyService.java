package com.rubixcube.edusphere.service;

import com.rubixcube.edusphere.model.Faculty;

import java.util.List;

public interface FacultyService {

    Faculty getFacultyByFacultyID(long facultyID);
    List<Faculty> getFacultiesByIDs(List<Long> facultyIDs);
    
}
