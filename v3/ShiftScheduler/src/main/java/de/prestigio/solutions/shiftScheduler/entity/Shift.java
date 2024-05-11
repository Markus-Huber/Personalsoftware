package de.prestigio.solutions.shiftScheduler.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

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
    private Instant begin;

    @Column(name = "endH", nullable = false)
    private Instant end;

    @Column(name = "breakIncluded", nullable = false)
    private Boolean breakIncluded = Boolean.FALSE;

    @Column(name = "breakH", nullable = false)
    private Instant breakDuration;

    @Column(name = "scheduledDate", nullable = false)
    private LocalDate scheduledDate;

    @ManyToOne
    @JoinColumn(name = "division")
    private Division division;
}