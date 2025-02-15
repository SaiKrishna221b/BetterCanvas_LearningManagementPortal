# Use OpenJDK as the base image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy Maven files
COPY pom.xml mvnw ./
COPY .mvn .mvn

# Grant execution permission to `mvnw`
RUN chmod +x mvnw

# Force Bash for executing `mvnw`
RUN bash -c "./mvnw dependency:go-offline"

# Copy project files
COPY src ./src

# Build the application
RUN ./mvnw package -DskipTests

# Expose the application port
EXPOSE 8001

# Run the application
CMD ["java", "-jar", "target/*.jar"]
