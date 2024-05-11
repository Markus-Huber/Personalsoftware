package de.prestigio.solutions.shiftScheduler.security.service;

import de.prestigio.solutions.shiftScheduler.entity.dto.EmployeeDTO;
import de.prestigio.solutions.shiftScheduler.entity.dto.ShiftDTO;
import de.prestigio.solutions.shiftScheduler.service.repository.ShiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShiftService {

    @Autowired
    ShiftRepository shiftRepository;

    public List<ShiftDTO> findShiftsBetween(final LocalDate from, final LocalDate till){
        return shiftRepository.findShiftsBetween(from, till).stream().map(ShiftDTO::convert).toList();
    }
}