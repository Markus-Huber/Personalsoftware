package de.prestigio.solutions.shiftScheduler.entity.dto;

import de.prestigio.solutions.shiftScheduler.entity.Division;
import de.prestigio.solutions.shiftScheduler.entity.EmployeeShift;
import de.prestigio.solutions.shiftScheduler.entity.Shift;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ShiftDTO {
    private Long id;
    private LocalDate referenceDate;
    private DivisionDTO cm;
    private List<EmployeeDTO> mitarbeiter = new ArrayList<>();
    private Instant begin;
    private Instant end;

    public static ShiftDTO convert(final Shift shift) {
        if (shift == null) {
            return null;
        }
        final ShiftDTO ret = new ShiftDTO();
        ret.setId(shift.getId());
        ret.setReferenceDate(shift.getScheduledDate());
        ret.setCm(DivisionDTO.convert(shift.getDivision()));
        ret.setMitarbeiter(
                shift.getEmployeeShifts().stream().map(EmployeeShift::getEmployee).map(EmployeeDTO::convert).toList());
        ret.setBegin(shift.getBegin());
        ret.setEnd(shift.getEnd());
        return ret;
    }
}