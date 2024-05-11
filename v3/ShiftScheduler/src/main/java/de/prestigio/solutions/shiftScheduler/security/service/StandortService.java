package de.prestigio.solutions.shiftScheduler.security.service;

import de.prestigio.solutions.shiftScheduler.entity.dto.StandortDTO;
import de.prestigio.solutions.shiftScheduler.service.repository.StandortRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StandortService {

    @Autowired
    StandortRepository standortRepository;

    public List<StandortDTO> findActiveStandorte(){
        return standortRepository.findActiveStandorte().stream().map(StandortDTO::convert).toList();
    }
}