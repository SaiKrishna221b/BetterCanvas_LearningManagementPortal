package com.rubixcube.edusphere.service;

import com.rubixcube.edusphere.model.Semester;

import java.util.Optional;

public interface SemesterService {

    Semester getSemesterBySemID(String semID);
}
