package de.prestigio.solutions.shiftScheduler.security.service;

import de.prestigio.solutions.shiftScheduler.entity.Division;
import de.prestigio.solutions.shiftScheduler.entity.Employee;
import de.prestigio.solutions.shiftScheduler.entity.Shift;
import de.prestigio.solutions.shiftScheduler.entity.dto.SaveShiftDTO;
import de.prestigio.solutions.shiftScheduler.entity.dto.ShiftDTO;
import de.prestigio.solutions.shiftScheduler.service.repository.ShiftRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ShiftService {

    @Autowired
    ShiftRepository shiftRepository;

    @PersistenceContext
    private EntityManager entityManager;

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
        // Wird das Objekt, dass save zurückgibt direkt zurückgegeben, sind die ManyToOne Attribute (bis auf den PK)
        // alle null..
        entityManager.detach(shift);
        shift = shiftRepository.findById(shift.getId()).orElseThrow(() -> new IllegalStateException("Schicht existiert nicht!"));
        return ShiftDTO.convert(shift);
    }

    public ShiftDTO updateShift(SaveShiftDTO shiftDTO) {
        Shift shift = shiftRepository.findById(shiftDTO.getId())
                .orElseThrow(() -> new IllegalStateException("Schicht existiert nicht!"));

        shift.setBegin(shiftDTO.getBegin());
        shift.setEnd(shiftDTO.getEnd());
        shift.setScheduledDate(shiftDTO.getReferenceDate());

        Division division = new Division();
        division.setId(shiftDTO.getCm());
        shift.setDivision(division);

        shift.setEmployees(shiftDTO.getMitarbeiter().stream().map(Employee::new).toList());

        shift = shiftRepository.save(shift);
        // Wird das Objekt, dass save zurückgibt direkt zurückgegeben, sind die ManyToOne Attribute (bis auf den PK)
        // alle null..
        entityManager.detach(shift);
        shift = shiftRepository.findById(shift.getId()).orElseThrow(() -> new IllegalStateException("Schicht existiert nicht!"));
        return ShiftDTO.convert(shift);
    }

    public void deleteShift(final Long shiftId){
        shiftRepository.deleteById(shiftId);
    }

    public void copyShifts(LocalDate oldFrom, LocalDate oldTill, LocalDate newFrom, LocalDate newTill, boolean withEmployees) {
        Collection<Shift> shiftsBetween = shiftRepository.findShiftsBetween(oldFrom, oldTill);

        long diffInDays = ChronoUnit.DAYS.between(oldFrom, newFrom);
        List<Shift> newShifts = new ArrayList<>();
        shiftsBetween.forEach(shift -> {
            Shift newShift = new Shift();
            newShift.setScheduledDate(shift.getScheduledDate().plusDays(diffInDays));
            newShift.setBegin(shift.getBegin());
            newShift.setEnd(shift.getEnd());
            newShift.setDivision(shift.getDivision());
            if(withEmployees){
                newShift.setEmployees(shift.getEmployees().stream().map(Employee::getId).map(Employee::new).toList());
            }
            newShifts.add(newShift);
        });

        shiftRepository.saveAll(newShifts);
    }
}