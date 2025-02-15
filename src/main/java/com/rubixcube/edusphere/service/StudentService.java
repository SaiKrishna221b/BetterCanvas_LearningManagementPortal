package com.rubixcube.edusphere.service;

import com.rubixcube.edusphere.dao.StudentDao;
import com.rubixcube.edusphere.model.Courses;
import com.rubixcube.edusphere.model.Student;

import java.util.List;

public interface StudentService {
    Student getStudentDetails(long studentID);
    List<Student> getStudentsByIDs(List<Long> studentIDs);

    Student saveStudentDetails(Student student);
}
