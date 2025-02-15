package com.rubixcube.edusphere.service;

import com.rubixcube.edusphere.model.Grades;

import java.util.List;

public interface GradeService {
    Grades findGradesByCourseBySem(Long studentID, String semID, long courseID);
}
