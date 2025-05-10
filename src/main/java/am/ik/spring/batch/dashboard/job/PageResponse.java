package am.ik.spring.batch.dashboard.job;

import java.util.List;
import org.jilt.Builder;
import org.jilt.BuilderStyle;

@Builder(style = BuilderStyle.STAGED_PRESERVING_ORDER)
public record PageResponse<T>(List<T> content, int page, int size, long totalElements, int totalPages) {
}
