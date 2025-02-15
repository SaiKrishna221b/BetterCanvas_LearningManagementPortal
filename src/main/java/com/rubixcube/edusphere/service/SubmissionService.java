package com.rubixcube.edusphere.service;

import com.rubixcube.edusphere.model.Grades;
import com.rubixcube.edusphere.model.Submission;

import java.util.List;

public interface SubmissionService {
    List<Grades> findAllGradesByCourseBySem(Long studentID, String semID, long courseID);

    List<List<String>>getSubmissionDetails(long studentID,String semID, long courseID);

    Submission findSubmissionById(long id);

    List<Submission> findAllSubmissionsByCourseBySem(Long studentID, String semID, long courseID);

    Submission gradeSubmission(Submission submission);
}
