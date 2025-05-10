package am.ik.spring.batch.dashboard.job;

import java.util.List;
import org.jilt.Builder;
import org.jilt.BuilderStyle;
import org.springframework.lang.Nullable;

@Builder(style = BuilderStyle.STAGED_PRESERVING_ORDER, toBuilder = "from")
public record JobInstanceDetail(long jobInstanceId, String jobName, String jobKey, int version,
		@Nullable JobExecutionSummary latestExecution, List<JobExecution> executions) {
}