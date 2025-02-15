package com.rubixcube.edusphere.service.impl;


import com.rubixcube.edusphere.dao.AssignmentDao;
import com.rubixcube.edusphere.dao.QuizDao;
import com.rubixcube.edusphere.model.Announcements;
import com.rubixcube.edusphere.model.Assignments;
import com.rubixcube.edusphere.model.Quizzes;
import com.rubixcube.edusphere.service.AssignmentService;
import com.rubixcube.edusphere.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssignmentServiceImpl implements AssignmentService {

    @Autowired
    AssignmentDao assignmentDao;

    //students call this to get published assignments
    public List<Assignments> getAssignmentBySemByCourse(String semID, long courseID) {
        return assignmentDao.findAllAssignmentsBySemByCourse(semID, courseID).orElse(null);
    }

    //faculty calls this to get all assignments
    public List<Assignments> getAssignmentDetails( String semID, long courseID){
        return assignmentDao.findAssignmentDetails(semID, courseID).orElse(null);
    }

    public Assignments createAssignment(Assignments assignment){

        return assignmentDao.save(assignment);
    }

    public Assignments getAssignmentByID(Long assignmentID) {
        return assignmentDao.findAssignmentById(assignmentID).orElse(null);
    }


}
