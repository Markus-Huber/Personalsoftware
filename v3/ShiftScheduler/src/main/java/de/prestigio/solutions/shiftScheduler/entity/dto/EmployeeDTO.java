package de.prestigio.solutions.shiftScheduler.entity.dto;

import de.prestigio.solutions.shiftScheduler.entity.Employee;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class EmployeeDTO {
    private Long id;
    private Integer workingHours;
    private String email;
    private String firstName;
    private String lastName;

    public static EmployeeDTO convert(final Employee employee) {
        return new EmployeeDTO(employee.getId(), employee.getWorkingHours(),
                employee.getEmail(), employee.getFirstName(), employee.getLastName());
    }
}