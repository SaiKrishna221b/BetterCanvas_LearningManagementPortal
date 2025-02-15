package com.rubixcube.edusphere.model;


import jakarta.persistence.*;
import lombok.*;

import java.sql.Time;
import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name="quizzes")
@Entity
public class Quizzes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long quizID;

    @ManyToOne
    @JoinColumn(name = "semid")
    private Semester sem;
    @ManyToOne
    @JoinColumn(name = "courseid")
    private Courses courses;
    private String quizName;
    private Timestamp dueDate;
    private Timestamp startDateTime;
    private String duration;
    private int questions;
    private String instructions;
    private String content;
    private double totalPoints;
    private boolean publishStatus;

  /*  @OneToOne(mappedBy = "quiz")
    private Submission submission; */
}
