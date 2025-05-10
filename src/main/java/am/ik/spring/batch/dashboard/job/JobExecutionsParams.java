package am.ik.spring.batch.dashboard.job;

import java.time.LocalDateTime;
import org.jilt.Builder;
import org.jilt.BuilderStyle;
import org.springframework.lang.Nullable;

@Builder(style = BuilderStyle.STAGED_PRESERVING_ORDER)
public record JobExecutionsParams(@Nullable String jobName, @Nullable JobStatus status,
		@Nullable LocalDateTime startDateFrom, @Nullable LocalDateTime startDateTo, @Nullable Integer page,
		@Nullable Integer size, @Nullable String sort) {
}
