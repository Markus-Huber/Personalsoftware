package de.prestigio.solutions.shiftScheduler.entity.dto;

import de.prestigio.solutions.shiftScheduler.entity.Workinghours;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class WorkinghoursDTO {
    private Long id;
    private String name;
    private BigDecimal bdPrice;

    public static WorkinghoursDTO convert(final Workinghours workinghours) {
        if (workinghours == null) {
            return null;
        }
        return new WorkinghoursDTO(workinghours.getId(), workinghours.getName(), workinghours.getBdPrice());
    }
}