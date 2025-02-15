package com.rubixcube.edusphere.model;


import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name="enrollments")
@Entity
public class Enrollments {

    @Id
    private long enrollmentID;
    @ManyToOne
    @JoinColumn(name = "studentid")
    private Student student;
    @ManyToOne
    @JoinColumn(name = "semid")
    private Semester sem;
    @ManyToOne
    @JoinColumn(name = "courseid")
    private Courses courses;
    private Timestamp enrollmentDate;
}
