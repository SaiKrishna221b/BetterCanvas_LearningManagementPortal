package com.rubixcube.edusphere.dao;


import com.rubixcube.edusphere.model.Announcements;
import com.rubixcube.edusphere.model.CoursesPerSem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@EnableJpaRepositories
@Repository
public interface AnnouncementsDao extends JpaRepository<Announcements, Long> {

    @Query(value = "select * from announcements where courseid = ?2 and semid = ?1", nativeQuery = true)
    List<Announcements> findAnnouncementsBySemidAndCourseid(String semID, long courseID);

    @Query(value = "select * from announcements where semid = ?1 and courseid = ?1", nativeQuery = true)
    Optional<List<Announcements>> getAnnouncementsBySemAndCourse(String semID, long courseID);

}