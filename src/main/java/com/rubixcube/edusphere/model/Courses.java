package com.rubixcube.edusphere.model;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name="courses")
@Entity
public class Courses {

    @Id
    private long courseID;
    private String courseName;

   /* @OneToOne(mappedBy = "course")
    private CoursesPerSem coursesPerSem; */

}
