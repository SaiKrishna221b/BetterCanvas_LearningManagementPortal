package com.rubixcube.edusphere.dao;


import com.rubixcube.edusphere.model.Grades;
import com.rubixcube.edusphere.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@EnableJpaRepositories
@Repository
public interface GradesDao extends JpaRepository<Grades, Long> {
    @Query(value = "select * from grades where studentID =?1 and semid = ?2 and courseid = ?3", nativeQuery = true)
    Optional<Grades> findGradesByCourseBySem(Long studentID, String semID, long courseID);
}
