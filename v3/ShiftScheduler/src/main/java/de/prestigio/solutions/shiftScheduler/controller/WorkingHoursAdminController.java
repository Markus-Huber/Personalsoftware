package de.prestigio.solutions.shiftScheduler.controller;

import de.prestigio.solutions.shiftScheduler.entity.dto.WorkinghoursDTO;
import de.prestigio.solutions.shiftScheduler.security.config.RoleAdmin;
import de.prestigio.solutions.shiftScheduler.security.service.WorkingHoursService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/workingHours")
public class WorkingHoursAdminController {

    @Autowired
    WorkingHoursService workingHoursService;

    @RoleAdmin
    @PostMapping
    public List<WorkinghoursDTO> findShiftsBetween() {
        return workingHoursService.findActiveWorkingHours();
    }
}