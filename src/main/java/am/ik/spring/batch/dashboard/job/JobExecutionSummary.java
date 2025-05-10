package am.ik.spring.batch.dashboard.job;

import java.time.LocalDateTime;
import org.jilt.Builder;
import org.jilt.BuilderStyle;
import org.springframework.lang.Nullable;

@Builder(style = BuilderStyle.STAGED_PRESERVING_ORDER)
public record JobExecutionSummary(long jobExecutionId, LocalDateTime startTime, @Nullable LocalDateTime endTime,
		JobStatus status) {
}
