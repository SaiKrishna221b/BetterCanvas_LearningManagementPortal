package com.rubixcube.edusphere.service.impl;

import com.rubixcube.edusphere.dao.UserDao;
import com.rubixcube.edusphere.model.User;
import com.rubixcube.edusphere.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserDao userDao;

    @Autowired
    public UserServiceImpl(UserDao userDao) {
        this.userDao = userDao;
    }

    public User loginUser(User user) {

        Optional<User> authenticatedUser = userDao.findByUserIDAndPassword(user.getUserID(), user.getPassword());

        return authenticatedUser.orElse(null);
    }
}

