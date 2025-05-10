package am.ik.spring.batch.dashboard.job;

import org.jilt.Builder;
import org.jilt.BuilderStyle;

@Builder(style = BuilderStyle.STAGED_PRESERVING_ORDER)
public record JobParameter(String name, String type, String value, boolean identifying) {
}