package am.ik.spring.batch.dashboard;

import org.springframework.boot.SpringApplication;

public class TestSpringBatchDashboardApplication {

	public static void main(String[] args) {
		SpringApplication.from(SpringBatchDashboardApplication::main)
			.with(TestcontainersConfiguration.class)
			.run("--spring.sql.init.mode=always", "", "--spring.docker.compose.enabled=false");
	}

}
