package am.ik.spring.batch.dashboard.config;

import am.ik.spring.batch.dashboard.job.ApiError;
import am.ik.spring.batch.dashboard.job.DailyJobStats;
import am.ik.spring.batch.dashboard.job.JobExecution;
import am.ik.spring.batch.dashboard.job.JobExecutionContext;
import am.ik.spring.batch.dashboard.job.JobExecutionDetail;
import am.ik.spring.batch.dashboard.job.JobExecutionStats;
import am.ik.spring.batch.dashboard.job.JobExecutionSummary;
import am.ik.spring.batch.dashboard.job.JobExecutionsParams;
import am.ik.spring.batch.dashboard.job.JobInstance;
import am.ik.spring.batch.dashboard.job.JobInstanceDetail;
import am.ik.spring.batch.dashboard.job.JobInstancesParams;
import am.ik.spring.batch.dashboard.job.JobParameter;
import am.ik.spring.batch.dashboard.job.JobSpecificStatistics;
import am.ik.spring.batch.dashboard.job.JobStatistics;
import am.ik.spring.batch.dashboard.job.JobStatisticsMapper;
import am.ik.spring.batch.dashboard.job.PageResponse;
import am.ik.spring.batch.dashboard.job.StepExecutionContext;
import am.ik.spring.batch.dashboard.job.StepExecutionDetail;
import am.ik.spring.batch.dashboard.job.StepExecutionSummary;
import java.util.List;
import org.springframework.aot.hint.MemberCategory;
import org.springframework.aot.hint.ReflectionHints;
import org.springframework.aot.hint.RuntimeHints;
import org.springframework.aot.hint.RuntimeHintsRegistrar;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportRuntimeHints;

@Configuration(proxyBeanMethods = false)
@ImportRuntimeHints(NativeConfig.NativeRuntimeHints.class)
public class NativeConfig {

	public static class NativeRuntimeHints implements RuntimeHintsRegistrar {

		@Override
		public void registerHints(RuntimeHints hints, ClassLoader classLoader) {
			ReflectionHints reflection = hints.reflection();
			List.of(ApiError.class, DailyJobStats.class, JobExecution.class, JobExecutionContext.class,
					JobExecutionDetail.class, JobExecutionsParams.class, JobExecutionStats.class,
					JobExecutionSummary.class, JobInstance.class, JobInstanceDetail.class, JobInstancesParams.class,
					JobParameter.class, JobSpecificStatistics.class, JobStatistics.class, PageResponse.class,
					StepExecutionContext.class, StepExecutionDetail.class, StepExecutionSummary.class,
					JobStatisticsMapper.StatusCount.class)
				.forEach(clazz -> reflection.registerType(clazz, MemberCategory.INVOKE_PUBLIC_METHODS,
						MemberCategory.INVOKE_PUBLIC_CONSTRUCTORS));
		}

	}

}