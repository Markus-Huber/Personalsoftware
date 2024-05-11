package de.prestigio.solutions.shiftScheduler.entity.dto;

import de.prestigio.solutions.shiftScheduler.entity.Division;
import de.prestigio.solutions.shiftScheduler.entity.Shift;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DivisionDTO {
    private Long id;
    private String name;
    private String color;

    public static DivisionDTO convert(final Division division){
        return new DivisionDTO(division.getId(), division.getName(), division.getColor());
    }
}