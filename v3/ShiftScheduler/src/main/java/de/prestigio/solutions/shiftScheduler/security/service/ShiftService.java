package de.prestigio.solutions.shiftScheduler.security.service;

import de.prestigio.solutions.shiftScheduler.entity.Division;
import de.prestigio.solutions.shiftScheduler.entity.Employee;
import de.prestigio.solutions.shiftScheduler.entity.Shift;
import de.prestigio.solutions.shiftScheduler.entity.dto.SaveShiftDTO;
import de.prestigio.solutions.shiftScheduler.entity.dto.ShiftDTO;
import de.prestigio.solutions.shiftScheduler.service.repository.ShiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShiftService {

    @Autowired
    ShiftRepository shiftRepository;

    public List<ShiftDTO> findShiftsBetween(final LocalDate from, final LocalDate till) {
        return shiftRepository.findShiftsBetween(from, till).stream().map(ShiftDTO::convert).toList();
    }

    public ShiftDTO createShift(SaveShiftDTO shiftDTO) {
        Shift shift = new Shift();
        shift.setBegin(shiftDTO.getBegin());
        shift.setEnd(shiftDTO.getEnd());
        shift.setScheduledDate(shiftDTO.getReferenceDate());

        Division division = new Division();
        division.setId(shiftDTO.getCm());
        shift.setDivision(division);

        shift.setEmployees(shiftDTO.getMitarbeiter().stream().map(Employee::new).toList());

        shift = shiftRepository.save(shift);
        return ShiftDTO.convert(shift);
    }
}