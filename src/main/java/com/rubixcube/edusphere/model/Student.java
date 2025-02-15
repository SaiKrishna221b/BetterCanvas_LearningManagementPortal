package com.rubixcube.edusphere.model;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name="student")
@Entity
public class Student {

    @Id
    private long studentID;
    private String emailID;
    private String name;
    private long contact;

   /* @OneToMany(mappedBy = "student")
    private List<Enrollments> enrollments; */

}
