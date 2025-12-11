package com.example.Product.Service.model;

import com.example.Product.Service.enums.ComplainStatus;
import jakarta.persistence.*;
import jdk.jshell.JShell;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Complain {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String complainNumber;
    private String username;
    private Long mobile;
    private String email;
    private String address;
    private String complain;
    private LocalDate complainDate;
    @Enumerated(EnumType.STRING)
    private ComplainStatus status;
    private String complainResponse;
    @ManyToOne
    @JoinColumn(name = "manager_id")
    private Manager manager;
}
