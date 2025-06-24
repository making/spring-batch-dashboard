package am.ik.spring.batch.dashboard.job;

import org.jilt.Builder;
import org.jilt.BuilderStyle;

@Builder(style = BuilderStyle.STAGED_PRESERVING_ORDER)
public record ExecutionContext(String shortContext, String serializedContext) {
}
