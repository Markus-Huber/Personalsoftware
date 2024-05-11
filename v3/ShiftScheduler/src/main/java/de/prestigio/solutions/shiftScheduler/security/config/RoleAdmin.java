package de.prestigio.solutions.shiftScheduler.security.config;

import org.springframework.security.access.annotation.Secured;

@Secured("ROLE_ADMIN")
public @interface RoleAdmin {
}
