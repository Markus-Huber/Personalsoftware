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
import java.util.List;

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
        shift = (Shift) entityManager.createQuery("from Shift where id = :id")
                .setParameter("id", shift.getId()).getSingleResult();
        return ShiftDTO.convert(shift);
    }
}