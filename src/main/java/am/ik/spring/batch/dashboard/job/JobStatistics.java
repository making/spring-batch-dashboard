package am.ik.spring.batch.dashboard.job;

import java.util.List;
import java.util.Map;
import org.jilt.Builder;
import org.jilt.BuilderStyle;

@Builder(style = BuilderStyle.STAGED_PRESERVING_ORDER)
public record JobStatistics(long totalJobs, Map<JobStatus, Long> jobsByStatus, List<DailyJobStats> recentJobStatuses) {
}
