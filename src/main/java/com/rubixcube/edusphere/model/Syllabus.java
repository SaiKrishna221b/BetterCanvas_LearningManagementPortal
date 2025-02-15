package com.rubixcube.edusphere.model;


import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name="syllabus")
@Entity
public class Syllabus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long syllabusID;
    @ManyToOne
    @JoinColumn(name = "semid")
    private Semester sem;
    @ManyToOne
    @JoinColumn(name = "courseid")
    private Courses courses;
    private String content;

}
