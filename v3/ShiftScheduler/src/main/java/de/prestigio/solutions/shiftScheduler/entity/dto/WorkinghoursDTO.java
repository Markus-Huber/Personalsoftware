package de.prestigio.solutions.shiftScheduler.entity.dto;

import de.prestigio.solutions.shiftScheduler.entity.Workinghours;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class WorkinghoursDTO {
    private Long id;
    private String name;
    private BigDecimal hours;

    public static WorkinghoursDTO convert(final Workinghours workinghours) {
        if (workinghours == null) {
            return null;
        }
        return new WorkinghoursDTO(workinghours.getId(), workinghours.getName(), workinghours.getHours());
    }
}