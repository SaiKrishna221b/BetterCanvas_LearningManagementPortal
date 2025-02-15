package com.rubixcube.edusphere.model;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name="admin")
@Entity
public class Admin {

    @Id
    private long adminID;
    private String emailID;
    private String name;
    private long contact;
}
