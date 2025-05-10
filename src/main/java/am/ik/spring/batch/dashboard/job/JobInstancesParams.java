package am.ik.spring.batch.dashboard.job;

import org.jilt.Builder;
import org.jilt.BuilderStyle;
import org.springframework.lang.Nullable;

@Builder(style = BuilderStyle.STAGED_PRESERVING_ORDER)
public record JobInstancesParams(@Nullable String jobName, @Nullable Integer page, @Nullable Integer size,
		@Nullable String sort) {
}