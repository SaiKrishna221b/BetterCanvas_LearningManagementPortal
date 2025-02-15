package com.rubixcube.edusphere.dao;


import com.rubixcube.edusphere.model.Enrollments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@EnableJpaRepositories
@Repository
public interface EnrollmentDao extends JpaRepository<Enrollments, Long> {

    @Query(value = "select courseid from enrollments where semid = ?1 and studentid = ?2", nativeQuery = true)
    Optional<List<Long>> findCourseIdsByStudentBySem(String semID, long studentID);

    @Query(value = "select studentid from enrollments where courseid=?1 and semid=?2", nativeQuery = true)
    Optional<List<Long>> getStudentIDsByCourseBySem(long courseID, String semID);

    @Query(value = "select student.studentid, student.name " +
            "from enrollments " +
            "join student on enrollments.studentid = student.studentid " +
            "where enrollments.semid = ?1 and enrollments.courseid = ?2", nativeQuery = true)
    List<List<String>> findStudentDetails(String semID, long courseID);
}
