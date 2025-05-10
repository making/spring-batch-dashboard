package am.ik.spring.batch.dashboard.job;

import java.time.LocalDateTime;
import java.util.Map;
import org.jilt.Builder;
import org.jilt.BuilderStyle;

@Builder(style = BuilderStyle.STAGED_PRESERVING_ORDER)
public record JobSpecificStatistics(String jobName, long totalExecutions, Map<JobStatus, Long> executionsByStatus,
		double averageDuration, // in seconds
		LocalDateTime lastExecutionTime, double successRate // percentage
) {
}