package am.ik.spring.batch.dashboard.job;

import java.time.LocalDateTime;
import java.util.Optional;

import am.ik.spring.batch.dashboard.utils.ExecutionContextDeserializer;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class StepExecutionMapper {

	private final JdbcClient jdbcClient;

	private final ExecutionContextDeserializer executionContextDeserializer;

	public StepExecutionMapper(JdbcClient jdbcClient, ExecutionContextDeserializer executionContextDeserializer) {
		this.jdbcClient = jdbcClient;
		this.executionContextDeserializer = executionContextDeserializer;
	}

	public Optional<StepExecutionDetail> getStepExecutionDetail(long stepExecutionId) {
		Optional<StepExecutionDetail> stepExecution = this.jdbcClient.sql("""
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
				ORDER BY
				    se.END_TIME DESC
				""")
			.param("stepExecutionId", stepExecutionId)
			.query((rs, rowNum) -> StepExecutionDetailBuilder.stepExecutionDetail()
				.stepExecutionId(rs.getLong("STEP_EXECUTION_ID"))
				.stepName(rs.getString("STEP_NAME"))
				.status(StepStatus.valueOf(rs.getString("STATUS")))
				.readCount(rs.getLong("READ_COUNT"))
				.writeCount(rs.getLong("WRITE_COUNT"))
				.filterCount(rs.getLong("FILTER_COUNT"))
				.startTime(rs.getObject("START_TIME", LocalDateTime.class))
				.endTime(rs.getObject("END_TIME", LocalDateTime.class))
				.jobExecutionId(rs.getLong("JOB_EXECUTION_ID"))
				.version(rs.getInt("VERSION"))
				.createTime(rs.getObject("CREATE_TIME", LocalDateTime.class))
				.commitCount(rs.getLong("COMMIT_COUNT"))
				.readSkipCount(rs.getLong("READ_SKIP_COUNT"))
				.writeSkipCount(rs.getLong("WRITE_SKIP_COUNT"))
				.processSkipCount(rs.getLong("PROCESS_SKIP_COUNT"))
				.rollbackCount(rs.getLong("ROLLBACK_COUNT"))
				.exitCode(rs.getString("EXIT_CODE"))
				.exitMessage(rs.getString("EXIT_MESSAGE"))
				.lastUpdated(rs.getObject("LAST_UPDATED", LocalDateTime.class))
				.build())
			.optional();

		return stepExecution.map(se -> {
			ExecutionContext executionContext = this.jdbcClient.sql("""
					SELECT
					    ec.SHORT_CONTEXT,
					    ec.SERIALIZED_CONTEXT
					FROM
					    BATCH_STEP_EXECUTION_CONTEXT ec
					WHERE
					    ec.STEP_EXECUTION_ID = :stepExecutionId
					""").param("stepExecutionId", stepExecutionId).query(ExecutionContext.class).single();
			return StepExecutionDetailBuilder.from(se)
				.executionContext(executionContextDeserializer.deserialize(executionContext))
				.build();
		});
	}

}
