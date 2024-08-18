# Stage 1: Build the application
FROM maven:3.9.8-eclipse-temurin-22 AS builder

# Set working directory
WORKDIR /app

# Copy the Maven configuration files
COPY pom.xml .
COPY src ./src

COPY .env .env

# Set build-time arguments
ARG DB_LINK
ARG DB_PASSWORD
ARG DB_USERNAME
ARG OPENAI_API_KEY

# Set environment variables
ENV DB_LINK=${DB_LINK}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_USERNAME=${DB_USERNAME}
ENV OPENAI_API_KEY=${OPENAI_API_KEY}

RUN echo "Debugging environment variables:" && \
    echo "DB_LINK: $DB_LINK" && \
    echo "DB_USERNAME: $DB_USERNAME" && \
    echo "DB_PASSWORD: $DB_PASSWORD" && \
    echo "OPENAI_API_KEY: $OPENAI_API_KEY"
# Package the application
RUN mvn clean package

# Stage 2: Create the runtime image
FROM eclipse-temurin:22-jre-jammy

# Set working directory
WORKDIR /app

# Copy the JAR file from the builder stage
COPY --from=builder /app/target/*.jar /app/app.jar

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]