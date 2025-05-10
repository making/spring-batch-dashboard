package am.ik.spring.batch.dashboard.job.web;

import am.ik.spring.batch.dashboard.job.ApiErrorBuilder;
import am.ik.spring.batch.dashboard.job.JobExecutionMapper;
import am.ik.spring.batch.dashboard.job.JobExecutionsParams;
import java.time.Clock;
import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JobExecutionController {

	private final JobExecutionMapper jobExecutionMapper;

	private final Clock clock;

	public JobExecutionController(JobExecutionMapper jobExecutionMapper, Clock clock) {
		this.jobExecutionMapper = jobExecutionMapper;
		this.clock = clock;
	}

	@GetMapping(path = "/api/job_executions")
	public ResponseEntity<?> findJobExecutions(@ModelAttribute JobExecutionsParams params) {
		return ResponseEntity.ok(this.jobExecutionMapper.findJobExecutions(params));
	}

	@GetMapping(path = "/api/job_executions/{jobExecutionId}")
	public ResponseEntity<?> getJobExecution(@PathVariable long jobExecutionId) {
		return this.jobExecutionMapper.getJobExecutionDetail(jobExecutionId)
			.<ResponseEntity<?>>map(ResponseEntity::ok)
			.orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
				.body(ApiErrorBuilder.apiError()
					.timestamp(LocalDateTime.now(this.clock))
					.status(HttpStatus.NOT_FOUND.value())
					.error(HttpStatus.NOT_FOUND.getReasonPhrase())
					.message("Job execution not found (jobExecutionId: " + jobExecutionId + ")")
					.path("/api/job_executions/" + jobExecutionId)
					.build()));
	}

}
