package de.prestigio.solutions.shiftScheduler.security.config;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;

public class Role implements GrantedAuthority {

    /** Die Security Rollen im Schichtplaner */
    enum Rolle {
        ROLE_ADMIN,
        ROLE_USER
    }

    @Getter
    private final String authority;

    public static final Role ROLE_ADMIN = new Role(Rolle.ROLE_ADMIN);
    public static final Role ROLE_USER = new Role(Rolle.ROLE_USER);

    private Role(Rolle role){
        this.authority = role.toString();
    }
}