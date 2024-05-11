package de.prestigio.solutions.shiftScheduler.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "workinghours")
public class Workinghours {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "isActive", nullable = false)
    private Boolean isActive = Boolean.TRUE;

    @Column(name = "hours", precision = 4, scale = 2, columnDefinition="DECIMAL(4,2)")
    private BigDecimal bdPrice;
}