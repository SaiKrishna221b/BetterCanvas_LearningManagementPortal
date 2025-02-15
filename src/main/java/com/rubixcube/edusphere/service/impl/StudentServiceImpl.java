package com.rubixcube.edusphere.service.impl;

import com.rubixcube.edusphere.dao.StudentDao;
import com.rubixcube.edusphere.model.Courses;
import com.rubixcube.edusphere.model.Student;
import com.rubixcube.edusphere.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentDao studentDao;

    public StudentServiceImpl(StudentDao studentDao) {
        this.studentDao = studentDao;
    }

    public Student getStudentDetails(long studentID) {
        return studentDao.findStudentByStudentID(studentID).orElse(null);
    }

    public List<Student> getStudentsByIDs(List<Long> studentIDs) {
        return studentDao.findStudentsByStudentIDIn(studentIDs).orElse(null);
    }

    public Student saveStudentDetails(Student student){
        return studentDao.save(student);
    }

}
