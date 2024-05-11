package de.prestigio.solutions.shiftScheduler.entity.dto;

import de.prestigio.solutions.shiftScheduler.entity.Standort;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class StandortDTO {
    private Long id;
    private String name;

    public static StandortDTO convert(final Standort standort) {
        return new StandortDTO(standort.getId(), standort.getName());
    }
}