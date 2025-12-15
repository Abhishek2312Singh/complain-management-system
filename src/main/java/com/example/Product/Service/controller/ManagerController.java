package com.example.Product.Service.controller;

import com.example.Product.Service.dto.UserOutputDto;
import com.example.Product.Service.service.ManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController("/manager")
public class ManagerController {
    @Autowired
    private ManagerService managerService;
    @GetMapping("/getall")
    public ResponseEntity<List<UserOutputDto>> gettAllManager(){
        return ResponseEntity.ok(managerService.find)
    }
}
