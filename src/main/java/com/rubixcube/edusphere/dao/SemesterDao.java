package com.rubixcube.edusphere.dao;

import com.rubixcube.edusphere.model.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@EnableJpaRepositories
@Repository
public interface SemesterDao extends JpaRepository<Semester,String> {

    @Query(value = "select * from semester where semid = ?1", nativeQuery = true)
    Optional<Semester> findSemesterBySemID(String semID);

}
