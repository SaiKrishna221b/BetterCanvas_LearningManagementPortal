package com.rubixcube.edusphere.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="grades")
@Entity
public class Grades {

    @Id
    private long gradeID;
    private Double grades;
    private long courseID;
    private String semID;
    private long studentID;

}
