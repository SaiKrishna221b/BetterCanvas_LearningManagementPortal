package com.rubixcube.edusphere.model;


import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name="submission")
@Entity
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long submissionID;

    @OneToOne
    @JoinColumn(name = "assignmentid")
    private Assignments assignment;

    @ManyToOne
    @JoinColumn(name = "semid")
    private Semester sem;

    @ManyToOne
    @JoinColumn(name = "courseid")
    private Courses courses;

    @OneToOne
    @JoinColumn(name = "quizid")
    private Quizzes quiz;

    @OneToOne
    @JoinColumn(name = "studentid")
    private Student student;

    private double pointScored;

    private Timestamp submissionDate;

    private String submissionContent;

}
