# Spring Batch Dashboard

A lightweight viewer application for Spring Batch Metadata tables with a clean, modern UI.

## Overview

Spring Batch Dashboard is a standalone application that connects to existing Spring Batch Metadata tables to provide visualization. Unlike Spring Batch Admin or Spring Cloud Data Flow, it does not launch tasks but serves as a simple viewer for batch job data.

Spring Batch Metadata is often underutilized - many projects use in-memory databases that discard execution data or accumulate data without analyzing it. This dashboard makes that valuable information visible.

This dashboard is extremely simple with no additional setup required beyond the application itself. You can be up and running in minutes, making it easy to try out and immediately see the value of your batch metadata.

## Screenshots

![Image](https://github.com/user-attachments/assets/ea1a4dab-5251-495f-8090-9b439040b527)

![Image](https://github.com/user-attachments/assets/0e8852d3-3470-45ce-b927-a780ff735f66)

![Image](https://github.com/user-attachments/assets/1f255666-75a8-41f2-9861-027d6e5c3519)

![Image](https://github.com/user-attachments/assets/e51f96ee-8a70-46c2-8509-83941f873482)

![Image](https://github.com/user-attachments/assets/7efa6a8b-d5a9-43f1-9aba-422eaf8dffb8)

![Image](https://github.com/user-attachments/assets/40d4788e-ec66-4a4e-97e8-dc9b5538568d)

## Requirements

- Java 21 or higher
- PostgreSQL database (currently the only supported database)
- Spring Batch Metadata tables must already exist in the database

## Running the Application

Build and run the application with:

```bash
./mvnw clean package -DskipTests
java -jar target/spring-batch-dashboard-0.0.1-SNAPSHOT.jar \
  --spring.datasource.url=jdbc:postgresql://${METADATA_DB_HOST}:${METADATA_DB_PORT}/${METADATA_DB_NAME} \
  --spring.datasource.username=${METADATA_DB_USERNAME} \
  --spring.datasource.password=${METADATA_DB_PASSWORD} \
  --spring.security.user.name=${DASHBOARD_USERNAME} \
  --spring.security.user.password=${DASHBOARD_PASSWORD}
```

Go to `http://localhost:8080` in your browser to access the dashboard.

Replace the environment variables with your actual database connection details and dashboard credentials.

You can also use a pre-built Docker image:

```bash
docker run --rm --name spring-batch-dashboard -p 8080:8080 ghcr.io/making/spring-batch-dashboard:native \
  --spring.datasource.url=jdbc:postgresql://${METADATA_DB_HOST}:${METADATA_DB_PORT}/${METADATA_DB_NAME} \
  --spring.datasource.username=${METADATA_DB_USERNAME} \
  --spring.datasource.password=${METADATA_DB_PASSWORD} \
  --spring.security.user.name=${DASHBOARD_USERNAME} \
  --spring.security.user.password=${DASHBOARD_PASSWORD}
```

`ghcr.io/making/spring-batch-dashboard:native` is a native image built with GraalVM, so it should start up faster. If you have issues starting it, use `ghcr.io/making/spring-batch-dashboard:jvm` instead, and report the issue.

> [!TIP]
> If you want to set up a dedicated database for your metadata tables, see this article (https://ik.am/entries/845/en) for a quick guide on how to set it up.

## Current Limitations

- PostgreSQL support only
- View-only functionality (does not launch or manage batch jobs)
- Simple in-memory user management with form authentication

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.