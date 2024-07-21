package de.prestigio.solutions.shiftScheduler.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "shift")
public class Shift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "isTemplate", nullable = false)
    private Boolean isTemplate = Boolean.FALSE;

    @Column(name = "isActive", nullable = false)
    private Boolean isActive = Boolean.TRUE;

    @Column(name = "startH", nullable = false)
    private LocalDateTime begin;

    @Column(name = "endH", nullable = false)
    private LocalDateTime end;

    @Column(name = "breakIncluded", nullable = false)
    private Boolean breakIncluded = Boolean.FALSE;

    @Column(name = "breakH", nullable = false)
    private LocalDateTime breakDuration = LocalDateTime.now().withHour(0).withMinute(0);

    @Column(name = "scheduledDate", nullable = false)
    private LocalDate scheduledDate;

    @ManyToOne
    @JoinColumn(name = "division")
    private Division division;

    @ManyToMany
    @JoinTable(
            name = "employeeshift",
            joinColumns = @JoinColumn(name = "shift"),
            inverseJoinColumns = @JoinColumn(name = "employee"))
    private List<Employee> employees = new ArrayList<>();

    public void setEmployees(final List<Employee> employees){
        this.employees.clear();
        if(employees != null){
            this.employees.addAll(employees);
        }
    }
}