package de.prestigio.solutions.shiftScheduler.service.repository;

import de.prestigio.solutions.shiftScheduler.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByLogin(String login);

    @Query(value="from Employee where isActive = true and id in (select employee.id from EmployeeStandort where standort.id = ?1)")
    List<Employee> findActiveEmployeesByStandort(Long standort);
}