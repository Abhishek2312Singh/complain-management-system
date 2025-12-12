package com.example.Product.Service.repository;

import com.example.Product.Service.model.Manager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ManagerRepo extends JpaRepository<Manager,Long> {
    Optional<Manager> findByUsername(String username);
}
