package com.example.Product.Service.dto;

import lombok.Data;

@Data
public class ComplainInputDto {
    private String username;
    private Long mobile;
    private String email;
    private String address;
    private String complain;
}
