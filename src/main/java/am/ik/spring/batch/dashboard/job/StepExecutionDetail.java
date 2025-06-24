package am.ik.spring.batch.dashboard.job;

import java.time.LocalDateTime;
import java.util.List;

import org.jilt.Builder;
import org.jilt.BuilderStyle;
import org.springframework.lang.Nullable;

@Builder(style = BuilderStyle.STAGED_PRESERVING_ORDER, toBuilder = "from")
public record StepExecutionDetail(long stepExecutionId, String stepName, StepStatus status, long readCount,
		long writeCount, long filterCount, LocalDateTime startTime, @Nullable LocalDateTime endTime,
		long jobExecutionId, int version, LocalDateTime createTime, long commitCount, long readSkipCount,
		long writeSkipCount, long processSkipCount, long rollbackCount, String exitCode, @Nullable String exitMessage,
		LocalDateTime lastUpdated, @Nullable List<ExecutionContextItem> executionContext) {
}
