package am.ik.spring.batch.dashboard.job;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class JobStatisticsMapper {

	private final JdbcClient jdbcClient;

	private final ObjectMapper objectMapper;

	public JobStatisticsMapper(JdbcClient jdbcClient, ObjectMapper objectMapper) {
		this.jdbcClient = jdbcClient;
		this.objectMapper = objectMapper;
	}

	public JobStatistics getJobStatistics(int days) {
		return this.jdbcClient.sql("""
				WITH job_stats AS (
				    SELECT
				        COUNT(DISTINCT ji.JOB_NAME) AS totalJobs
				    FROM
				        BATCH_JOB_INSTANCE ji
				),
				status_counts AS (
				    SELECT
				        je.STATUS,
				        COUNT(*) AS count
				    FROM
				        BATCH_JOB_EXECUTION je
				    GROUP BY
				        je.STATUS
				),
				daily_stats AS (
				    SELECT
				        DATE(je.START_TIME) AS date,
				        SUM(
				            CASE
				                WHEN je.STATUS = 'COMPLETED' THEN 1
				                ELSE 0
				            END
				        ) AS completed,
				        SUM(
				            CASE
				                WHEN je.STATUS = 'FAILED' THEN 1
				                ELSE 0
				            END
				        ) AS failed,
				        SUM(
				            CASE
				                WHEN je.STATUS = 'ABANDONED' THEN 1
				                ELSE 0
				            END
				        ) AS abandoned
				    FROM
				        BATCH_JOB_EXECUTION je
				    WHERE
				        je.START_TIME IS NOT NULL
				    AND je.START_TIME >= CURRENT_DATE - INTERVAL '%d days'
				    GROUP BY
				        DATE(je.START_TIME)
				    ORDER BY
				        date DESC
				    LIMIT %d
				)
				SELECT
				    js.totalJobs,
				    (SELECT json_agg(sc.*) FROM status_counts sc) AS statusCounts,
				    (SELECT json_agg(ds.*) FROM daily_stats ds) AS dailyStats
				FROM
				    job_stats js;
				""".formatted(days, days)).query((rs, rowNum) -> {
			try {
				Map<JobStatus, Long> jobsByStatus = null;
				List<DailyJobStats> recentJobStatuses = null;
				String statusCountsJson = rs.getString("statusCounts");
				if (statusCountsJson != null) {
					List<StatusCount> statusCounts = objectMapper.readValue(statusCountsJson, new TypeReference<>() {
					});
					if (statusCounts != null) {
						jobsByStatus = statusCounts.stream()
							.collect(Collectors.toMap(StatusCount::status, StatusCount::count, (a, b) -> a));
					}
				}
				String dailyStatsJson = rs.getString("dailyStats");
				if (dailyStatsJson != null) {
					recentJobStatuses = objectMapper.readValue(dailyStatsJson, new TypeReference<>() {
					});
				}
				return JobStatisticsBuilder.jobStatistics()
					.totalJobs(rs.getLong("totalJobs"))
					.jobsByStatus(Objects.requireNonNullElseGet(jobsByStatus, Map::of))
					.recentJobStatuses(Objects.requireNonNullElseGet(recentJobStatuses, List::of))
					.build();
			}
			catch (IOException e) {
				throw new UncheckedIOException(e);
			}
		}).single();
	}

	public Optional<JobSpecificStatistics> getJobStatisticsByJobName(String jobName) {
		return this.jdbcClient.sql("""
				WITH job_data AS (
				    SELECT
				        je.JOB_EXECUTION_ID,
				        je.STATUS,
				        je.START_TIME,
				        je.END_TIME,
				        EXTRACT(EPOCH FROM (je.END_TIME - je.START_TIME)) AS duration_seconds
				    FROM
				        BATCH_JOB_EXECUTION je
				    JOIN
				        BATCH_JOB_INSTANCE ji ON je.JOB_INSTANCE_ID = ji.JOB_INSTANCE_ID
				    WHERE
				        ji.JOB_NAME = :jobName
				),
				total_stats AS (
				    SELECT
				        COUNT(*) AS totalExecutions,
				        MAX(START_TIME) AS lastExecutionTime,
				        AVG(duration_seconds) FILTER (WHERE duration_seconds IS NOT NULL) AS averageDuration,
				        COUNT(*) FILTER (WHERE STATUS = 'COMPLETED') AS completedCount,
				        (COUNT(*) FILTER (WHERE STATUS = 'COMPLETED') * 100.0 /
				         NULLIF(COUNT(*), 0)) AS successRate
				    FROM
				        job_data
				),
				status_stats AS (
				    SELECT
				        STATUS,
				        COUNT(*) AS count
				    FROM
				        job_data
				    GROUP BY
				        STATUS
				)
				SELECT
				    :jobName AS jobName,
				    ts.totalExecutions,
				    ts.lastExecutionTime,
				    ts.averageDuration,
				    ts.successRate,
				    json_agg(ss.*) AS executionsByStatus
				FROM
				    total_stats ts
				CROSS JOIN LATERAL (SELECT * FROM status_stats) ss
				GROUP BY
				    ts.totalExecutions, ts.lastExecutionTime, ts.averageDuration, ts.successRate
				""").param("jobName", jobName).query((rs, rowNum) -> {
			try {
				Map<JobStatus, Long> executionsByStatus = null;
				String executionsByStatusJson = rs.getString("executionsByStatus");
				if (executionsByStatusJson != null) {
					List<StatusCount> statusCounts = objectMapper.readValue(executionsByStatusJson,
							new TypeReference<>() {
							});
					if (statusCounts != null) {
						executionsByStatus = statusCounts.stream()
							.collect(Collectors.toMap(StatusCount::status, StatusCount::count, (a, b) -> a));
					}
				}
				return JobSpecificStatisticsBuilder.jobSpecificStatistics()
					.jobName(rs.getString("jobName"))
					.totalExecutions(rs.getLong("totalExecutions"))
					.executionsByStatus(Objects.requireNonNullElseGet(executionsByStatus, Map::of))
					.averageDuration(rs.getDouble("averageDuration"))
					.lastExecutionTime(rs.getObject("lastExecutionTime", LocalDateTime.class))
					.successRate(rs.getDouble("successRate"))
					.build();
			}
			catch (IOException e) {
				throw new UncheckedIOException(e);
			}
		}).optional();
	}

	public List<JobExecutionStats> getJobExecutionStats(int days) {
		return this.jdbcClient.sql("""
				SELECT
				    ji.JOB_NAME AS jobName,
				    COUNT(je.JOB_EXECUTION_ID) AS executions
				FROM
				    BATCH_JOB_INSTANCE ji
				    JOIN
				        BATCH_JOB_EXECUTION je
				    ON  ji.JOB_INSTANCE_ID = je.JOB_INSTANCE_ID
				WHERE
				    je.START_TIME >= CURRENT_DATE - INTERVAL '%d days'
				GROUP BY
				    ji.JOB_NAME
				ORDER BY
				    executions DESC,
				    jobName
				""".formatted(days)).query(JobExecutionStats.class).list();
	}

	public record StatusCount(JobStatus status, Long count) {
	}

}
