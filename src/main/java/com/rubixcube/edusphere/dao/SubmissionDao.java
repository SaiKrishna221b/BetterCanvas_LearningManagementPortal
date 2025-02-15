package com.rubixcube.edusphere.dao;


import com.rubixcube.edusphere.model.Grades;
import com.rubixcube.edusphere.model.Quizzes;
import com.rubixcube.edusphere.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@EnableJpaRepositories
@Repository
public interface SubmissionDao extends JpaRepository<Submission, Long> {
    @Query(value = "select * from submission where studentID =?1 and semid = ?2 and courseid = ?3", nativeQuery = true)
    Optional<List<Grades>> findAllGradesByCourseBySem(Long studentID, String semID, long courseID);

    @Query("SELECT " +
            "CASE WHEN s.assignment IS NOT NULL THEN a.assignmentName ELSE q.quizName END AS name, " +
            "CASE WHEN s.assignment IS NOT NULL THEN a.dueDate ELSE q.dueDate END AS dueDate, " +
            "s.pointScored, " +
            "CASE WHEN s.assignment IS NOT NULL THEN a.totalPoints ELSE q.totalPoints END AS totalPoints " +
            "FROM Submission s " +
            "LEFT JOIN s.assignment a " +
            "LEFT JOIN s.quiz q " +
            "WHERE s.student.studentID = ?1 AND s.sem.semID = ?2 AND s.courses.courseID = ?3")
    List<Object[]> findSubmissionDetails(Long studentID, String semID, long courseID);

    @Query(value = "select * from submission where submissionID =?1", nativeQuery = true)
    Optional<Submission> findSubmissionByID(long id);

    @Query(value = "select * from submission where studentID =?1 and semid = ?2 and courseid = ?3", nativeQuery = true)
    Optional<List<Submission>> findAllSubmissionsByCourseBySem(Long studentID,String semID, long courseID);
 }
