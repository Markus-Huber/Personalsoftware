package de.prestigio.solutions.shiftScheduler.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class SaveShiftDTO {
    private LocalDate referenceDate;
    private Long cm;
    private List<Long> mitarbeiter = new ArrayList<>();
    private LocalDateTime begin;
    private LocalDateTime end;
}