package com.rubixcube.edusphere.model;


import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name="announcements")
@Entity
public class Announcements {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long announcementID;
    @ManyToOne
    @JoinColumn(name = "semid")
    private Semester sem;
    @ManyToOne
    @JoinColumn(name = "courseid")
    private Courses courses;
    private String description;
    private Timestamp announcementDate;
}