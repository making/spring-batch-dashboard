package am.ik.spring.batch.dashboard.job.web;

import am.ik.spring.batch.dashboard.job.JobInstanceMapper;
import am.ik.spring.batch.dashboard.job.JobInstancesParams;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JobInstanceController {

	private final JobInstanceMapper jobInstanceMapper;

	public JobInstanceController(JobInstanceMapper jobInstanceMapper) {
		this.jobInstanceMapper = jobInstanceMapper;
	}

	@GetMapping(path = "/api/job_instances")
	public ResponseEntity<?> findJobInstances(@ModelAttribute JobInstancesParams params) {
		return ResponseEntity.ok(this.jobInstanceMapper.findJobInstances(params));
	}

	@GetMapping(path = "/api/job_instances/{jobInstanceId}")
	public ResponseEntity<?> findJobInstances(@PathVariable long jobInstanceId) {
		return ResponseEntity.of(this.jobInstanceMapper.getJobInstanceDetail(jobInstanceId));
	}

}
