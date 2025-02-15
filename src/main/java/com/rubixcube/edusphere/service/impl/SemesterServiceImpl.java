package com.rubixcube.edusphere.service.impl;


import com.rubixcube.edusphere.dao.SemesterDao;
import com.rubixcube.edusphere.model.Semester;
import com.rubixcube.edusphere.service.SemesterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SemesterServiceImpl implements SemesterService {

    @Autowired
    private SemesterDao semesterDao;

    public Semester getSemesterBySemID(String semID) {

        return semesterDao.findSemesterBySemID(semID).orElse(null);
    }

}
