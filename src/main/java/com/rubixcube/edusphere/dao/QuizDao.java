package com.rubixcube.edusphere.dao;


import com.rubixcube.edusphere.model.Quizzes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@EnableJpaRepositories
@Repository
public interface QuizDao extends JpaRepository<Quizzes, Long> {

    //for student
    @Query(value = "select * from quizzes where semid = ?1 and courseid = ?2 and publish_status=true", nativeQuery = true)
    Optional<List<Quizzes>> findAllQuizzesBySemByCourse(String semID, long courseID);

    //for faculty
    @Query(value = "select * from quizzes where semid = ?1 and courseid = ?2", nativeQuery = true)
    Optional<List<Quizzes>>findQuizzes(String semID,long courseID);

    @Query(value = "select * from quizzes where quizid = ?1", nativeQuery = true)
    Optional<Quizzes> findQuizById(long quizID);

}
