package com.example.Product.Service.service;

import com.example.Product.Service.config.SecurityConfig;
import com.example.Product.Service.model.User;
import com.example.Product.Service.repository.UserRepo;
import org.hibernate.annotations.Comment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.security.Security;

@Component
public class CreateAdminUser {
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private SecurityConfig config;
    @Bean
    public CommandLineRunner createAdminTest(){
        return args -> {
          if(userRepo.findByUsername("admin").isEmpty()){
              User user = new User();
              user.setUsername("admin");
              user.setPassword(config.encoder().encode("admin"));
              userRepo.save(user);
              System.out.println("Admin Created!!");
          }
        };
    }
}
