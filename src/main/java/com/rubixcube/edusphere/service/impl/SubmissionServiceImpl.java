package com.rubixcube.edusphere.service.impl;


import com.rubixcube.edusphere.dao.SubmissionDao;
import com.rubixcube.edusphere.model.Grades;
import com.rubixcube.edusphere.model.Submission;
import com.rubixcube.edusphere.service.SubmissionService;
import com.rubixcube.edusphere.model.Grades;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.sql.Timestamp;



import java.util.List;

@Service
public class SubmissionServiceImpl implements SubmissionService {

    @Autowired
    SubmissionDao submissionDao;

    public List<Grades> findAllGradesByCourseBySem(Long studentID, String semID, long courseID) {
        return submissionDao.findAllGradesByCourseBySem(studentID, semID, courseID).orElse(null);
    }

    public List<List<String>> getSubmissionDetails(long studentID,String semID, long courseID) {

        List<Object[]> submissionDetails = submissionDao.findSubmissionDetails(studentID, semID, courseID);
        List<List<String>> formattedDetails = new ArrayList<>();

        for (Object[] detail : submissionDetails) {
            List<String> formattedDetail = new ArrayList<>();
            formattedDetail.add((String) detail[0]); // Name
            formattedDetail.add(((Timestamp) detail[1]).toString()); // Due Date
            formattedDetail.add(String.valueOf(detail[2])); // Points Scored
            formattedDetail.add(String.valueOf(detail[3])); // Total Points
            formattedDetails.add(formattedDetail);
        }

        return formattedDetails;
    }

    public Submission gradeSubmission(Submission submission){
        return submissionDao.save(submission);
    }

    public Submission findSubmissionById(long id) {
        return submissionDao.findSubmissionByID(id).orElse(null);
    }

    public List<Submission> findAllSubmissionsByCourseBySem(Long studentID, String semID, long courseID) {
        return submissionDao.findAllSubmissionsByCourseBySem(studentID, semID, courseID).orElse(null);
    }

}
