package com.rubixcube.edusphere.model;


import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name="semester")
@Entity
public class Semester {

    @Id
    private String semID;            // semID is same as sem name. example Spring 2024
    private Date semStartDate;
    private Date semEndDate;

   /* @OneToMany(mappedBy = "sem")
    private List<CoursesPerSem> coursesPerSem; */
}
