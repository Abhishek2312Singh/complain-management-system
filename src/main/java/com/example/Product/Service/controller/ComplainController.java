package com.example.Product.Service.controller;

import com.example.Product.Service.dto.ComplainInputDto;
import com.example.Product.Service.service.ComplainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/complain")
@CrossOrigin("http://localhost:5173")
public class ComplainController {
    @Autowired
    private ComplainService complainService;
    @PostMapping("/generatecomplain")
    public ResponseEntity<String> authenticatedController(@RequestBody ComplainInputDto complainInputDto){
            return ResponseEntity.ok(complainService.addComplain(complainInputDto));
    }
    @GetMapping("/getcomplain")
    public ResponseEntity<?> getComplainById(@RequestParam String complainNumber){
        try{
            return ResponseEntity.ok(complainService.getComplainByComplainNumber(complainNumber));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
