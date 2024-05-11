package de.prestigio.solutions.shiftScheduler.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "employeeshift")
public class EmployeeSwitchedShift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "shift")
    private Shift shift;

    @ManyToOne
    @JoinColumn(name = "originalEmployee")
    private Employee originalEmployee;

    @ManyToOne
    @JoinColumn(name = "newEmployee")
    private Employee newEmployee;
}