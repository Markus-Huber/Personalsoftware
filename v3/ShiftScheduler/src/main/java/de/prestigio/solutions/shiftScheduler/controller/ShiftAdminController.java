package de.prestigio.solutions.shiftScheduler.controller;

import de.prestigio.solutions.shiftScheduler.entity.dto.SaveShiftDTO;
import de.prestigio.solutions.shiftScheduler.entity.dto.ShiftDTO;
import de.prestigio.solutions.shiftScheduler.entity.dto.TestDTO;
import de.prestigio.solutions.shiftScheduler.security.config.RoleAdmin;
import de.prestigio.solutions.shiftScheduler.security.service.ShiftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/shift")
public class ShiftAdminController {

    @Autowired
    ShiftService shiftService;

    @RoleAdmin
    @PostMapping
    public List<ShiftDTO> findShiftsBetween(@RequestParam("from") String from, @RequestParam("till") String till) throws ParseException {
        return shiftService.findShiftsBetween(LocalDate.parse(from), LocalDate.parse(till));
    }

    @RoleAdmin
    @PostMapping("create")
    public ShiftDTO createShift(@RequestBody final SaveShiftDTO shift){
        return shiftService.createShift(shift);
    }

    @RoleAdmin
    @PostMapping("update")
    public ShiftDTO updateShift(@RequestBody final SaveShiftDTO shift){
        return shiftService.updateShift(shift);
    }

    @RoleAdmin
    @PostMapping("delete")
    public void deleteShift(@RequestParam("shiftID") Long shiftID) {
        shiftService.deleteShift(shiftID);
    }

    @RoleAdmin
    @PostMapping("test")
    public void test(@RequestBody TestDTO testParam){
        System.out.println(testParam);
    }
}