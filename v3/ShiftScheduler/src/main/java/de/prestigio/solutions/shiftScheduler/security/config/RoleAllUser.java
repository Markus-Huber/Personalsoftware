package de.prestigio.solutions.shiftScheduler.security.config;

import org.springframework.security.access.annotation.Secured;

@Secured({"ROLE_ADMIN", "ROLE_USER"})
public @interface RoleAllUser {
}
