package am.ik.spring.batch.dashboard.job;

import java.util.Optional;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class StepExecutionMapper {

	private final JdbcClient jdbcClient;

	public StepExecutionMapper(JdbcClient jdbcClient) {
		this.jdbcClient = jdbcClient;
	}

	public Optional<StepExecutionDetail> getStepExecutionDetail(long stepExecutionId) {
		return this.jdbcClient.sql("""
				SELECT
				    se.STEP_EXECUTION_ID,
				    se.JOB_EXECUTION_ID,
				    se.STEP_NAME,
				    se.VERSION,
				    se.CREATE_TIME,
				    se.START_TIME,
				    se.END_TIME,
				    se.STATUS,
				    se.COMMIT_COUNT,
				    se.READ_COUNT,
				    se.FILTER_COUNT,
				    se.WRITE_COUNT,
				    se.READ_SKIP_COUNT,
				    se.WRITE_SKIP_COUNT,
				    se.PROCESS_SKIP_COUNT,
				    se.ROLLBACK_COUNT,
				    se.EXIT_CODE,
				    se.EXIT_MESSAGE,
				    se.LAST_UPDATED,
				    je.CREATE_TIME AS JOB_CREATE_TIME,
				    je.STATUS AS JOB_STATUS,
				    ji.JOB_NAME
				FROM
				    BATCH_STEP_EXECUTION se
				    JOIN
				        BATCH_JOB_EXECUTION je
				    ON  se.JOB_EXECUTION_ID = je.JOB_EXECUTION_ID
				    JOIN
				        BATCH_JOB_INSTANCE ji
				    ON  je.JOB_INSTANCE_ID = ji.JOB_INSTANCE_ID
				WHERE
				    se.STEP_EXECUTION_ID = :stepExecutionId
				""").param("stepExecutionId", stepExecutionId).query(StepExecutionDetail.class).optional();
	}

}
