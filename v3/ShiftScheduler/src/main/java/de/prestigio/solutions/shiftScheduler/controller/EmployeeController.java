package de.prestigio.solutions.shiftScheduler.controller;

import de.prestigio.solutions.shiftScheduler.entity.dto.EmployeeDTO;
import de.prestigio.solutions.shiftScheduler.security.config.RoleAdmin;
import de.prestigio.solutions.shiftScheduler.security.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

	@Autowired
	EmployeeService employeeService;

	@RoleAdmin
	@PostMapping
	public List<EmployeeDTO> findEmployees(@RequestParam("standort") String standort) {
		return employeeService.findActiveEmployeesByStandort(standort);
	}
}