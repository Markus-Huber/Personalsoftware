package de.prestigio.solutions.shiftScheduler.controller.greeting;

import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class WelcomeController {

	@Secured({"ROLE_ADMIN", "ROLE_USER"})
	@GetMapping("/")
	public String index() {
		return "index";
	}
}