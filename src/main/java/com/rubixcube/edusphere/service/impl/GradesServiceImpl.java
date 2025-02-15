package com.rubixcube.edusphere.service.impl;


import com.rubixcube.edusphere.dao.GradesDao;
import com.rubixcube.edusphere.dao.SubmissionDao;
import com.rubixcube.edusphere.model.Grades;
import com.rubixcube.edusphere.model.Submission;
import com.rubixcube.edusphere.service.GradeService;
import com.rubixcube.edusphere.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GradesServiceImpl implements GradeService {

    @Autowired
    GradesDao gradesDao;

    public Grades findGradesByCourseBySem(Long studentID, String semID, long courseID) {
        return gradesDao.findGradesByCourseBySem(studentID, semID, courseID).orElse(null);
    }

}
