package de.prestigio.solutions.shiftScheduler.controller;

import de.prestigio.solutions.shiftScheduler.entity.dto.StandortDTO;
import de.prestigio.solutions.shiftScheduler.security.config.RoleAdmin;
import de.prestigio.solutions.shiftScheduler.security.service.StandortService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/standort")
public class StandortAdminController {

    @Autowired
    StandortService standortService;

    @RoleAdmin
    @PostMapping
    public List<StandortDTO> findShiftsBetween() {
        return standortService.findActiveStandorte();
    }
}