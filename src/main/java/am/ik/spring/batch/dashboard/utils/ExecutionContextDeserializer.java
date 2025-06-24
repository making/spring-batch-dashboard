package am.ik.spring.batch.dashboard.utils;

import am.ik.spring.batch.dashboard.job.ExecutionContext;
import am.ik.spring.batch.dashboard.job.ExecutionContextItem;
import am.ik.spring.batch.dashboard.job.ExecutionContextItemBuilder;
import com.fasterxml.jackson.core.util.DefaultIndenter;
import com.fasterxml.jackson.core.util.DefaultPrettyPrinter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class ExecutionContextDeserializer {

	private static final Logger log = LoggerFactory.getLogger(ExecutionContextDeserializer.class);

	private final ObjectMapper objectMapper;

	private final DefaultPrettyPrinter prettyPrinter;

	public ExecutionContextDeserializer(ObjectMapper objectMapper) {
		this.objectMapper = new ObjectMapper();
		this.objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
		this.prettyPrinter = new DefaultPrettyPrinter();
		prettyPrinter.indentArraysWith(DefaultIndenter.SYSTEM_LINEFEED_INSTANCE);
	}

	@SuppressWarnings("unchecked")
	public List<ExecutionContextItem> deserialize(ExecutionContext executionContext) {

		var serializedContext = executionContext.serializedContext() != null ? executionContext.serializedContext()
				: executionContext.shortContext();

		ByteArrayInputStream inputStream = new ByteArrayInputStream(serializedContext.getBytes(StandardCharsets.UTF_8));

		var decodingStream = Base64.getDecoder().wrap(inputStream);
		try {
			var objectInputStream = new ObjectInputStream(decodingStream);
			var contextMap = (Map<String, Object>) objectInputStream.readObject();

			return contextMap.entrySet()
				.stream()
				.map(entry -> ExecutionContextItemBuilder.executionContextItem()
					.name(entry.getKey())
					.type(entry.getValue().getClass().getName())
					.value(serializeObject(entry.getValue()))
					.build())
				.collect(Collectors.toList());
		}
		catch (IOException | ClassNotFoundException e) {
			log.error("Failed to serialize object", e);
			return null;
		}
	}

	private String serializeObject(Object value) {
		if (value instanceof Integer || value instanceof Double || value instanceof Boolean
				|| value instanceof Character || value instanceof Byte || value instanceof Short
				|| value instanceof Long || value instanceof Float || value instanceof String || value instanceof Enum
				|| value instanceof LocalDate || value instanceof LocalDateTime) {
			return value.toString();
		}
		else {
			try {
				return objectMapper.writer(prettyPrinter).writeValueAsString(value);
			}
			catch (IOException e) {
				log.error("Failed to serialize object", e);
				return "<can not serialize object>";
			}
		}
	}

}
