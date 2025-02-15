package com.rubixcube.edusphere.dao;

import com.rubixcube.edusphere.model.Syllabus;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

@EnableJpaRepositories
@Repository
public interface SyllabusDao extends JpaRepository<Syllabus, Long> {


    @Query(value = "select content from syllabus where semid = ?1 and courseid = ?2", nativeQuery = true)
    String findContentBySemIDandCourseID(String semID,Long courseID);

    //Code not required. The .save() in syllabusServiceImpl does the insertion
    /*@Query(value = "UPDATE syllabus s SET s.content = ?3 WHERE s.semid = ?1 AND s.courseid = ?2 RETURNING s.*", nativeQuery = true)
    void updateContentBySemIDAndCourseID(String semID, Long courseID, String content);*/

    @Query(value = "select * from syllabus where semid = ?1 and courseid = ?2", nativeQuery = true)
    Syllabus getSyllabusObject(String semID,long courseID);
}
