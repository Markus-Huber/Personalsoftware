package de.prestigio.solutions.shiftScheduler.entity.dto;

import de.prestigio.solutions.shiftScheduler.entity.Employee;
import de.prestigio.solutions.shiftScheduler.entity.Workinghours;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class EmployeeDTO {
    private Long id;
    private WorkinghoursDTO workingHours;
    private String email;
    private String firstName;
    private String lastName;

    public static EmployeeDTO convert(final Employee employee) {
        if (employee == null) {
            return null;
        }
        return new EmployeeDTO(employee.getId(), WorkinghoursDTO.convert(employee.getWorkingHours()),
                employee.getEmail(), employee.getFirstName(), employee.getLastName());
    }
}