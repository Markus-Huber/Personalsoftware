package de.prestigio.solutions.shiftScheduler.entity;

import de.prestigio.solutions.shiftScheduler.security.config.Role;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;

import java.util.Collection;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "employee")
public class Employee implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "login", nullable = false)
    private String login;

    @Column(name = "isAdmin", nullable = false)
    private Boolean isAdmin = Boolean.FALSE;

    @Column(name = "isActive")
    private Boolean isActive = Boolean.FALSE;

    @Column(name = "loginCounter")
    private Integer loginCounter = 0;

    @ManyToOne
    @JoinColumn(name = "workingHours")
    private Workinghours workingHours;

    @Column(name = "password", nullable = false)
    private String password;

    /*@ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "customer_role",
            joinColumns = {@JoinColumn(name = "customer_id")},
            inverseJoinColumns = {@JoinColumn(name = "role_id")}
    )
    private Set<Role> authorities;*/

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "firstname")
    private String firstName;

    @Column(name = "lastName")
    private String lastName;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if(isAdmin){
            return List.of(Role.ROLE_ADMIN);
        }
        return List.of(Role.ROLE_USER);
    }

    @Override
    public String getUsername() {
        if(StringUtils.hasText(lastName)){
            return firstName + " " + lastName;
        }
        return firstName;
    }

    @Override
    public boolean isAccountNonExpired() {
        return getIsActive();
    }

    @Override
    public boolean isAccountNonLocked() {
        return getIsActive();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return getIsActive();
    }

    @Override
    public boolean isEnabled() {
        return getIsActive();
    }
}