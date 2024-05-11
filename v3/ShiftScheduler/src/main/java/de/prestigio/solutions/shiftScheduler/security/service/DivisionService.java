package de.prestigio.solutions.shiftScheduler.security.service;

import de.prestigio.solutions.shiftScheduler.entity.dto.DivisionDTO;
import de.prestigio.solutions.shiftScheduler.service.repository.DivisionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DivisionService {

    @Autowired
    DivisionRepository divisionRepository;

    public List<DivisionDTO> findActiveCMs(){
        return divisionRepository.findActiveDivisions().stream().map(DivisionDTO::convert).toList();
    }
}