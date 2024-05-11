package de.prestigio.solutions.shiftScheduler.service.repository;

import de.prestigio.solutions.shiftScheduler.entity.Standort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface StandortRepository extends JpaRepository<Standort, Long> {

    @Query(value="from Standort")
    List<Standort> findActiveStandorte();
}