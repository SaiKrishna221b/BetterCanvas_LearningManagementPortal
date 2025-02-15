package com.rubixcube.edusphere.dao;

import com.rubixcube.edusphere.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@EnableJpaRepositories
@Repository
public interface UserDao extends JpaRepository<User, Long> {
    Optional<User> findByUserIDAndPassword(long userId, String password);
}
