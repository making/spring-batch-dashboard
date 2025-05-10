package am.ik.spring.batch.dashboard.job.web;

import am.ik.spring.batch.dashboard.job.ApiErrorBuilder;
import am.ik.spring.batch.dashboard.job.JobStatisticsMapper;
import java.time.Clock;
import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JobStatisticsController {

	private final JobStatisticsMapper jobStatisticsMapper;

	private final Clock clock;

	public JobStatisticsController(JobStatisticsMapper jobStatisticsMapper, Clock clock) {
		this.jobStatisticsMapper = jobStatisticsMapper;
		this.clock = clock;
	}

	@GetMapping(path = "/api/statistics/jobs")
	public ResponseEntity<?> getJobStatistics(@RequestParam(defaultValue = "60") int days) {
		return ResponseEntity.ok(this.jobStatisticsMapper.getJobStatistics(days));
	}

	@GetMapping(path = "/api/statistics/jobs/{jobName}")
	public ResponseEntity<?> getJobStatisticsByJobName(@PathVariable String jobName) {
		return this.jobStatisticsMapper.getJobStatisticsByJobName(jobName)
			.<ResponseEntity<?>>map(ResponseEntity::ok)
			.orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
				.body(ApiErrorBuilder.apiError()
					.timestamp(LocalDateTime.now(this.clock))
					.status(HttpStatus.NOT_FOUND.value())
					.error(HttpStatus.NOT_FOUND.getReasonPhrase())
					.message("Job statistics not found (jobName: " + jobName + ")")
					.path("/api/statistics/jobs/" + jobName)
					.build()));
	}

	@GetMapping(path = "/api/statistics/recent_executions")
	public ResponseEntity<?> getRecentExecutions(@RequestParam(defaultValue = "60") int days) {
		return ResponseEntity.ok(this.jobStatisticsMapper.getJobExecutionStats(days));
	}

}
