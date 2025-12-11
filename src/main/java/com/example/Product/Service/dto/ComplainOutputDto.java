package com.example.Product.Service.dto;

import com.example.Product.Service.enums.ComplainStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ComplainOutputDto {
    private String complainNumber;
    private String username;
    private Long mobile;
    private String email;
    private String address;
    private String complain;
    private LocalDate complainDate;
    private ComplainStatus status;
    private String complainResponse;
    private String managerName;
    private String managerEmail;
    private Long managerMobile;
}
