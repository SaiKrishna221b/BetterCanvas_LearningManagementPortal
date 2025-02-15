package com.rubixcube.edusphere.service.impl;


import com.rubixcube.edusphere.dao.AdminDao;
import com.rubixcube.edusphere.model.Admin;
import com.rubixcube.edusphere.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminService {


    @Autowired
    AdminDao adminDao;

    public Admin getAdminDetails(long adminID) {
        return adminDao.findAdminByAdminID(adminID).orElse(null);
    }
}
