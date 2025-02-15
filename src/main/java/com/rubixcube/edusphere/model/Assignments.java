package com.rubixcube.edusphere.model;


import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name="assignments")
@Entity
public class Assignments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long assignmentID;
    @ManyToOne
    @JoinColumn(name = "semid")
    private Semester sem;
    @ManyToOne
    @JoinColumn(name = "courseid")
    private Courses courses;
    private String assignmentName;
    private Timestamp dueDate;
    private Timestamp uploadDate;
    private String content;
    private double totalPoints;
    private boolean publishStatus;

  /*  @OneToOne(mappedBy = "assignment")
    private Submission submission; */

}
