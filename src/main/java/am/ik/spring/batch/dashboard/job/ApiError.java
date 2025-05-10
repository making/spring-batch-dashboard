package am.ik.spring.batch.dashboard.job;

import java.time.LocalDateTime;
import org.jilt.Builder;
import org.jilt.BuilderStyle;

@Builder(style = BuilderStyle.STAGED_PRESERVING_ORDER)
public record ApiError(LocalDateTime timestamp, int status, String error, String message, String path) {
}
