package com.example.Product.Service.service;

import com.example.Product.Service.dto.ComplainInputDto;
import com.example.Product.Service.dto.ComplainOutputDto;
import com.example.Product.Service.enums.ComplainStatus;
import com.example.Product.Service.model.Complain;
import com.example.Product.Service.repository.ComplainRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ComplainService {
    @Autowired
    private ComplainRepo complainRepo;

    public ComplainOutputDto convertToDto(Complain complain){
        ComplainOutputDto complainOutputDto = new ComplainOutputDto();
        complainOutputDto.setComplain(complain.getComplain());
        complainOutputDto.setComplainDate(complain.getComplainDate());
        complainOutputDto.setUsername(complain.getUsername());
        complainOutputDto.setEmail(complain.getEmail());
        complainOutputDto.setAddress(complain.getAddress());
        complainOutputDto.setStatus(complain.getStatus());
        complainOutputDto.setComplainResponse(complain.getComplainResponse());
        complainOutputDto.setManagerEmail(complain.getManager().getEmail());
        complainOutputDto.setManagerName(complain.getManager().getFullName());
        complainOutputDto.setManagerMobile(complain.getManager().getMobile());
        return complainOutputDto;
    }

    public String addComplain(ComplainInputDto complainInputDto){
        Complain complain = new Complain();
        complain.setComplain(complainInputDto.getComplain());
        complain.setEmail(complainInputDto.getEmail());
        complain.setAddress(complainInputDto.getAddress());
        complain.setUsername(complainInputDto.getUsername());
        complain.setMobile(complainInputDto.getMobile());
        complain.setStatus(ComplainStatus.PENDING);
        complain.setComplainDate(LocalDate.now());
        String complainNumber = LocalDate.now().toString().replace("-","")
                + (1000 + complainRepo.countByComplainDate(LocalDate.now())) ;
        complain.setComplainNumber(complainNumber);
        complainRepo.save(complain);
        return complainNumber;
    }
    public ComplainOutputDto getComplainByComplainNumber(String complainNumber){
        Complain complain = complainRepo.findByComplainNumber(complainNumber).orElseThrow(()->new RuntimeException("No Complain Found!!"));
        ComplainOutputDto complainOutputDto = new ComplainOutputDto();
        complainOutputDto.setComplain(complain.getComplain());
        complainOutputDto.setComplainDate(complain.getComplainDate());
        complainOutputDto.setUsername(complain.getUsername());
        complainOutputDto.setEmail(complain.getEmail());
        complainOutputDto.setAddress(complain.getAddress());
        complainOutputDto.setStatus(complain.getStatus());
        if(complain.getStatus() == ComplainStatus.PENDING){
            return complainOutputDto;
        } else if (complain.getStatus() == ComplainStatus.IN_PROCESS) {
            complainOutputDto.setManagerEmail(complain.getManager().getEmail());
            complainOutputDto.setManagerName(complain.getManager().getFullName());
            complainOutputDto.setManagerMobile(complain.getManager().getMobile());
            return complainOutputDto;
        }
        else {
            complainOutputDto.setComplainResponse(complain.getComplainResponse());
            complainOutputDto.setManagerEmail(complain.getManager().getEmail());
            complainOutputDto.setManagerName(complain.getManager().getFullName());
            complainOutputDto.setManagerMobile(complain.getManager().getMobile());
            return complainOutputDto;
        }
    }
}
