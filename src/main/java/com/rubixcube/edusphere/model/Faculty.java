package com.rubixcube.edusphere.model;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name="faculty")
@Entity
public class Faculty {

    @Id
    private long facultyID;
    private String emailID;
    private String name;
    private long contact;

   /* @OneToMany(mappedBy = "faculty")
    private List<CoursesPerSem> coursesPerSem; */
}
