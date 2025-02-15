package com.rubixcube.edusphere.model;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name="courses_per_sem")
@Entity
public class CoursesPerSem {

    @Id
    private long coursesPerSemId;
    private boolean publishStatus;
    private String courseContent;

    @ManyToOne
    @JoinColumn(name = "semid")
    private Semester sem;
    @OneToOne
    @JoinColumn(name = "courseid")
    private Courses course;
    @ManyToOne
    @JoinColumn(name = "facultyid")
    private Faculty faculty;

   /* @OneToMany(mappedBy = "coursePerSem")
    private List<Enrollments> enrollments;
    @OneToMany(mappedBy = "coursePerSem")
    private List<Assignments> assignments;
    @OneToMany(mappedBy = "coursePerSem")
    private List<Quizzes> quizzes;
    @OneToOne(mappedBy = "coursePerSem")
    private Syllabus syllabus;
    @OneToMany(mappedBy = "coursePerSem")
    private List<Announcements> announcements;
    @OneToOne(mappedBy = "coursesPerSem")
    private Submission submission; */
}
