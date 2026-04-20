# Use official Java image
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy everything
COPY . .

# Build the app
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# Run the jar
CMD ["java", "-jar", "target/medical-api-0.0.1-SNAPSHOT.jar"]