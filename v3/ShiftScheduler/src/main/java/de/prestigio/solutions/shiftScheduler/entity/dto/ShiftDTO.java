package de.prestigio.solutions.shiftScheduler.entity.dto;

import de.prestigio.solutions.shiftScheduler.entity.Shift;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String begin;
    private String end;

    public static ShiftDTO convert(final Shift shift) {
        if (shift == null) {
            return null;
        }
        final ShiftDTO ret = new ShiftDTO();
        ret.setId(shift.getId());
        ret.setReferenceDate(shift.getScheduledDate());
        ret.setCm(DivisionDTO.convert(shift.getDivision()));
        if (shift.getEmployees() != null) {
            ret.setMitarbeiter(
                    shift.getEmployees().stream().map(EmployeeDTO::convert).toList());
        }
        ret.setBegin(shift.getBegin().toLocalTime().toString());
        ret.setEnd(shift.getEnd().toLocalTime().toString());
        return ret;
    }
}