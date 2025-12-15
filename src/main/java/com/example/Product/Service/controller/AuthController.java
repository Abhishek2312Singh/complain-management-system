package com.example.Product.Service.controller;

import com.example.Product.Service.dto.AuthInputDto;
import com.example.Product.Service.dto.UserInputDto;
import com.example.Product.Service.service.UserService;
import com.example.Product.Service.util.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
public class AuthController {
    @Autowired
    private UserService userService;
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
    @GetMapping("/getuser")
    public ResponseEntity<?> getUser(Principal principal){
        return ResponseEntity.ok(userService.getUser(principal));
    }
    @PutMapping("/updateuser")
    public ResponseEntity<?> updateUser(@RequestBody UserInputDto userInputDto,Principal principal){
        try{
            return ResponseEntity.ok(userService.updateUser(userInputDto,principal));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PutMapping("/updatepassword")
    public ResponseEntity<?> updatePassword(@RequestParam String currentPassword,@RequestParam String newPassword,
                                            @RequestParam String confirmPassword,Principal principal){
        try{
            return ResponseEntity.ok(userService.updatePassword(currentPassword,newPassword,
                    confirmPassword,principal));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
