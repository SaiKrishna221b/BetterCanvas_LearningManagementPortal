package com.rubixcube.edusphere.dao;

import com.rubixcube.edusphere.model.Courses;
import com.rubixcube.edusphere.model.Student;
import com.rubixcube.edusphere.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@EnableJpaRepositories
@Repository
public interface StudentDao extends JpaRepository<Student, Long> {

    Optional<Student> findStudentByStudentID(long studentID);
  //  @Query(value = "Select * from Student where studentid In :studentIds", nativeQuery = true)
    Optional<List<Student>> findStudentsByStudentIDIn(List<Long> studentIDs);

}
