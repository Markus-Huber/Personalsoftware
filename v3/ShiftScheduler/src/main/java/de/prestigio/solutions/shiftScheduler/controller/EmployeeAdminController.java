package de.prestigio.solutions.shiftScheduler.controller;

import de.prestigio.solutions.shiftScheduler.entity.dto.EmployeeDTO;
import de.prestigio.solutions.shiftScheduler.security.config.RoleAdmin;
import de.prestigio.solutions.shiftScheduler.security.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/employee")
public class EmployeeAdminController {

	@Autowired
	EmployeeService employeeService;

	@RoleAdmin
	@PostMapping
	public List<EmployeeDTO> findActiveEmployeesByStandort(@RequestParam("standort") String standort) {
		return employeeService.findActiveEmployeesByStandort(standort);
	}
}