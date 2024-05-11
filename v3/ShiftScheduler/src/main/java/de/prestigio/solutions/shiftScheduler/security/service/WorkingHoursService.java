package de.prestigio.solutions.shiftScheduler.security.service;

import de.prestigio.solutions.shiftScheduler.entity.dto.DivisionDTO;
import de.prestigio.solutions.shiftScheduler.entity.dto.WorkinghoursDTO;
import de.prestigio.solutions.shiftScheduler.service.repository.WorkingHoursRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkingHoursService {

    @Autowired
    WorkingHoursRepository workingHoursRepository;

    public List<WorkinghoursDTO> findActiveWorkingHours(){
        return workingHoursRepository.findActiveWorkingHours().stream().map(WorkinghoursDTO::convert).toList();
    }
}