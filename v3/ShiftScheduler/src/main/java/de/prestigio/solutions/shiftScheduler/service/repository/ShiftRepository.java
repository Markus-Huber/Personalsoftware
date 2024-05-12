package de.prestigio.solutions.shiftScheduler.service.repository;

import de.prestigio.solutions.shiftScheduler.entity.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.Collection;

public interface ShiftRepository extends JpaRepository<Shift, Long> {

    @Query(value="from Shift where scheduledDate between ?1 and ?2 and isActive = true order by scheduledDate")
    Collection<Shift> findShiftsBetween(LocalDate from, LocalDate till);
}