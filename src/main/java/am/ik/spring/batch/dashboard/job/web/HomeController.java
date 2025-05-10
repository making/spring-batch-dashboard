package am.ik.spring.batch.dashboard.job.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

	@GetMapping(path = { "/", "/job-instances", "/job-instances/**", "/job-executions", "/job-executions/**",
			"/step-executions", "/step-executions/**", "/statistics", "/statistics/**" })
	public String index() {
		return "forward:/index.html";
	}

}
