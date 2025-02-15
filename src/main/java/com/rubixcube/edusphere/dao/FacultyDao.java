package com.rubixcube.edusphere.dao;


import com.rubixcube.edusphere.model.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@EnableJpaRepositories
@Repository
public interface FacultyDao extends JpaRepository<Faculty,Long> {

    Optional<Faculty> findFacultyByFacultyID(long facultyID);


    @Query(value = "select * from faculty where facultyid in ?1", nativeQuery = true)
    Optional<List<Faculty>> getFacultiesByIDs(List<Long> facultyIDs);
}
