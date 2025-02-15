package com.rubixcube.edusphere.dao;


import com.rubixcube.edusphere.model.Courses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@EnableJpaRepositories
@Repository
public interface CoursesDao extends JpaRepository<Courses, Long> {

    @Query(value = "select * from courses where courseid = ?1", nativeQuery = true)
    Optional<Courses> findCoursesByCourseID(long courseID);



    Optional<List<Courses>> findAllByCourseIDIn(List<Long> courseIDs);
}
