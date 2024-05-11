package de.prestigio.solutions.shiftScheduler.controller;

import de.prestigio.solutions.shiftScheduler.entity.dto.DivisionDTO;
import de.prestigio.solutions.shiftScheduler.entity.dto.EmployeeDTO;
import de.prestigio.solutions.shiftScheduler.security.config.RoleAdmin;
import de.prestigio.solutions.shiftScheduler.security.service.DivisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cm")
public class CMController {

	@Autowired
	DivisionService divisionService;

	@RoleAdmin
	@PostMapping
	public List<DivisionDTO> findActiveCMs() {
		return divisionService.findActiveCMs();
	}
}