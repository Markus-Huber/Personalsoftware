package de.prestigio.solutions.shiftScheduler.rest.greeting;

import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WelcomeController {

	@Secured("ROLE_ADMIN")
	@GetMapping("/")
	public String index() {
		return "Greetings from Spring Boot!";
	}

}