package com.rubixcube.edusphere.service;

import com.rubixcube.edusphere.model.Quizzes;

import java.util.List;

public interface QuizService {

    //for students, returns those for which published=true
    List<Quizzes> getQuizzesBySemByCourse(String semID, long courseID);

    List<Quizzes> getQuizDetails( String semID,long courseID);

    Quizzes createQuiz(Quizzes quiz);

    Quizzes getQuizById(Long quizID);
}
