package com.rubixcube.edusphere.dao;


import com.rubixcube.edusphere.model.Assignments;
import com.rubixcube.edusphere.model.Quizzes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@EnableJpaRepositories
@Repository
public interface AssignmentDao extends JpaRepository<Assignments, Long> {
    //student call
    @Query(value = "select * from assignments where semid = ?1 and courseid = ?2 and publish_status=true", nativeQuery = true)
    Optional<List<Assignments>> findAllAssignmentsBySemByCourse(String semID, long courseID);

    //faculty call
    @Query(value = "select * from assignments where semid = ?1 and courseid = ?2", nativeQuery = true)
    Optional<List<Assignments>>findAssignmentDetails(String semID, long courseID);

    @Query(value = "select * from assignments where assignmentid = ?1", nativeQuery = true)
    Optional<Assignments> findAssignmentById(Long assignmentID);
}
