package am.ik.spring.batch.dashboard.job.web;

import am.ik.spring.batch.dashboard.job.ApiErrorBuilder;
import am.ik.spring.batch.dashboard.job.StepExecutionMapper;
import java.time.Clock;
import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StepExecutionController {

	private final StepExecutionMapper stepExecutionMapper;

	private final Clock clock;

	public StepExecutionController(StepExecutionMapper stepExecutionMapper, Clock clock) {
		this.stepExecutionMapper = stepExecutionMapper;
		this.clock = clock;
	}

	@GetMapping(path = "/api/step_executions/{stepExecutionId}")
	public ResponseEntity<?> getStepExecution(@PathVariable long stepExecutionId) {
		return this.stepExecutionMapper.getStepExecutionDetail(stepExecutionId)
			.<ResponseEntity<?>>map(ResponseEntity::ok)
			.orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
				.body(ApiErrorBuilder.apiError()
					.timestamp(LocalDateTime.now(this.clock))
					.status(HttpStatus.NOT_FOUND.value())
					.error(HttpStatus.NOT_FOUND.getReasonPhrase())
					.message("Step execution not found (stepExecutionId: " + stepExecutionId + ")")
					.path("/api/step_executions/" + stepExecutionId)
					.build()));
	}

}
