package de.prestigio.solutions.shiftScheduler.service.repository;

import de.prestigio.solutions.shiftScheduler.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByLogin(String login);

    @Query("from Employee where isActive = true")
    //@Query("select from Employee where isActive = 1 and id in (select employee from employeestandort where standort = ?1)")
    List<Employee> findActiveEmployeesByStandort(String standort);
}