package com.rubixcube.edusphere.dao;


import com.rubixcube.edusphere.model.CoursesPerSem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@EnableJpaRepositories
@Repository
public interface CoursesPerSemDao extends JpaRepository<CoursesPerSem, Long> {
    @Query(value = "select * from courses_per_sem where facultyid = ?2 and semid = ?1", nativeQuery = true)
    List<CoursesPerSem> findCoursesIdByFacultyBySem(String semID, long facultyID);

    @Query(value = "select * from courses_per_sem where semid = ?1 and courseid = ?2", nativeQuery = true)
    Optional<CoursesPerSem> findCoursesPerSemBySemAndCourse(String semID, long courseID);

    @Query(value = "select distinct semid from courses_per_sem where facultyid = ?1", nativeQuery = true)
    Optional<List<String>> findSemIDsByFacultyID(long facultyID);

    @Query(value = "select course_content from courses_per_sem where semid = ?1 and courseid = ?2", nativeQuery = true)
    Optional<String> findCourseContentBySem(String semID, long courseID);

    @Query(value = "select facultyid from courses_per_sem where semid = ?1", nativeQuery = true)
    Optional<List<Long>> getFacultiesIdBySem(String semID);
}
