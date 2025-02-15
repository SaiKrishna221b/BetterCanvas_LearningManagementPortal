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
@Table(name="user")
@Entity
public class User {

    @Id
    private long userID;
    private String password;
    private char userType;
}
