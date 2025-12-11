package com.example.Product.Service.controller;

import com.example.Product.Service.dto.AuthInputDto;
import com.example.Product.Service.util.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
    @Autowired
    private JWTUtil jwtUtil;
    @Autowired
    private AuthenticationManager manager;
    @PostMapping("/login")
    public ResponseEntity<String> getToken(@RequestBody AuthInputDto authInputDto){
        try{
            manager.authenticate(
            new UsernamePasswordAuthenticationToken(authInputDto.getUsername(),
                    authInputDto.getPassword()));
            return ResponseEntity.ok(jwtUtil.generateToken(authInputDto.getUsername()));
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
