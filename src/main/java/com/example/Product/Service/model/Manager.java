package com.example.Product.Service.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Manager {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private Long mobile;

    @OneToMany(mappedBy = "manager")
    private List<Complain> complainList;
}
