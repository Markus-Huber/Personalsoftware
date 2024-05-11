package de.prestigio.solutions.shiftScheduler.service.repository;

import de.prestigio.solutions.shiftScheduler.entity.Workinghours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface WorkingHoursRepository extends JpaRepository<Workinghours, Long> {

    @Query(value="from Workinghours where isActive = true")
    List<Workinghours> findActiveWorkingHours();
}