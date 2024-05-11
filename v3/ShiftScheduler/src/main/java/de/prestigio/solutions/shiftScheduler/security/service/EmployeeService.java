package de.prestigio.solutions.shiftScheduler.security.service;

import de.prestigio.solutions.shiftScheduler.entity.dto.EmployeeDTO;
import de.prestigio.solutions.shiftScheduler.service.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    @Autowired
    EmployeeRepository employeeRepository;

    public List<EmployeeDTO> findActiveEmployeesByStandort(final String Standort){
        return employeeRepository.findActiveEmployeesByStandort(Standort).stream().map(EmployeeDTO::convert).toList();
    }
}