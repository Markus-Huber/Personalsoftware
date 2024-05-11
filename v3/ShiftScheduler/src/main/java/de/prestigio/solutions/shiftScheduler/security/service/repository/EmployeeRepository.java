package de.prestigio.solutions.shiftScheduler.security.service.repository;

import de.prestigio.solutions.shiftScheduler.security.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByLogin(String login);

}