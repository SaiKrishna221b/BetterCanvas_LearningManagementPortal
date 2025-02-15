package com.rubixcube.edusphere.service.impl;

import com.rubixcube.edusphere.dao.SyllabusDao;
import com.rubixcube.edusphere.model.Syllabus;
import com.rubixcube.edusphere.service.SyllabusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SyllabusServiceImpl implements SyllabusService {

    @Autowired
    private SyllabusDao syllabusDao;

    public String getSyllabusContentBySemIDandCourseID(String semID, Long courseID){
    
        return syllabusDao.findContentBySemIDandCourseID(semID, courseID);
    }

    public Syllabus updateSyllabusContent(Syllabus syllabus){

        return syllabusDao.save(syllabus);

    }

    public Syllabus getSyllabusObject(String semID, Long courseID){

        return syllabusDao.getSyllabusObject(semID,courseID);
    }
}

