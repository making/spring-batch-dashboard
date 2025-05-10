package am.ik.spring.batch.dashboard.job.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginController {

	@GetMapping(path = "/login")
	public String login() {
		return "login";
	}

	@GetMapping(path = "/logout")
	public String logout() {
		return "logout";
	}

}