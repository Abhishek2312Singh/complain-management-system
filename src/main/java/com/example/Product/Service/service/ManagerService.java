package com.example.Product.Service.service;

import com.example.Product.Service.dto.ComplainOutputDto;
import com.example.Product.Service.dto.UserOutputDto;
import com.example.Product.Service.enums.ComplainStatus;
import com.example.Product.Service.model.Complain;
import com.example.Product.Service.model.Manager;
import com.example.Product.Service.repository.ComplainRepo;
import com.example.Product.Service.repository.ManagerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ManagerService {
    @Autowired
    private ComplainRepo complainRepo;
    @Autowired
    private ManagerRepo managerRepo;
    @Autowired
    private ComplainService complainService;
    public List<ComplainOutputDto> getComplainByManager(String username){
        List<Complain> complainList = complainRepo.findByManagerAndStatus(managerRepo.findByUsername(username).orElseThrow(
                        ()->new UsernameNotFoundException("Manager Not found!!!")
                ),
               ComplainStatus.PENDING);
        List<ComplainOutputDto> complainOutputDtos = new ArrayList<>();
        for(Complain complain : complainList){
            complainOutputDtos.add(complainService.convertToDto(complain));
        }
        return complainOutputDtos;
    }
    public ComplainOutputDto getComplainByNumber(String complainNumber){
        return complainService.getComplainByComplainNumber(complainNumber);
    }
    public void addResponse(String response, String complainNumber){
        Complain complain = complainRepo.findByComplainNumber(complainNumber).orElseThrow(()->new RuntimeException("Complain Not Found!!"));
        complain.setComplainResponse(response);
        complainRepo.save(complain);
    }
    public UserOutputDto getAllManager(){
        List<Manager> managers = managerRepo.findAll();
        List<>
    }
}
