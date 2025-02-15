package com.rubixcube.edusphere.service;

import com.rubixcube.edusphere.model.Assignments;
import com.rubixcube.edusphere.model.Quizzes;

import java.util.List;

public interface AssignmentService {

    List<Assignments> getAssignmentBySemByCourse(String semID, long courseID);

    List<Assignments> getAssignmentDetails( String semID, long courseID);

    Assignments createAssignment(Assignments assignment);

    Assignments getAssignmentByID(Long assignmentID);


}
