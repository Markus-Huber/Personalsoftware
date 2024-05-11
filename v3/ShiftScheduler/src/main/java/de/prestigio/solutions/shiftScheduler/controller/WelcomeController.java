package de.prestigio.solutions.shiftScheduler.controller;

import de.prestigio.solutions.shiftScheduler.security.config.RoleAllUser;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class WelcomeController {

	@RoleAllUser
	@GetMapping("/")
	public String index() {
		return "index";
	}
}