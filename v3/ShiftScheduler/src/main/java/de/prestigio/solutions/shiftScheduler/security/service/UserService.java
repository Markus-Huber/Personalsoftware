package de.prestigio.solutions.shiftScheduler.security.service;

import de.prestigio.solutions.shiftScheduler.security.entity.Employee;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //throw new UsernameNotFoundException("Username or password wrong");
        Employee ret = new Employee();
        ret.setFirstName(username);
        ret.setPassword("$2a$10$L/vx2GUxssWS0yuvDVSF4uK0YG55CkFayJKKdfv/Xyw3/gWP.830m");
        return ret;
    }
}