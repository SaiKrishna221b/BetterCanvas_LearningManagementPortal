package com.rubixcube.edusphere.service.impl;


import com.rubixcube.edusphere.dao.QuizDao;
import com.rubixcube.edusphere.model.Quizzes;
import com.rubixcube.edusphere.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizServiceImpl implements QuizService {

    @Autowired
    QuizDao quizDao;

    //for students, returns published quizzes only
    public List<Quizzes> getQuizzesBySemByCourse(String semID, long courseID) {
        return quizDao.findAllQuizzesBySemByCourse(semID, courseID).orElse(null);
    }

    //for faculty, returns all (published+unpublished)
    public List<Quizzes> getQuizDetails( String semID,long courseID){
        return quizDao.findQuizzes(semID, courseID).orElse(null);
    }

    public Quizzes createQuiz(Quizzes quiz){
        return quizDao.save(quiz);
    }

    public Quizzes getQuizById(Long quizID) {
        return quizDao.findQuizById(quizID).orElse(null);
    }

}
