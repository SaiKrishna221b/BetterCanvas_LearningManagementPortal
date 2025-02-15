package com.rubixcube.edusphere.service;


import com.rubixcube.edusphere.model.Syllabus;

import java.util.List;

public interface SyllabusService{

    String getSyllabusContentBySemIDandCourseID(String semID, Long courseID);

    Syllabus updateSyllabusContent(Syllabus syllabus);

    Syllabus getSyllabusObject(String semID, Long courseID);
}

