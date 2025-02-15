package com.rubixcube.edusphere.dao;

import com.rubixcube.edusphere.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@EnableJpaRepositories
@Repository
public interface AdminDao extends JpaRepository<Admin,Long> {

    Optional<Admin> findAdminByAdminID(long adminID);


}
