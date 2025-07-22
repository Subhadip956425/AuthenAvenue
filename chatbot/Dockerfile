# ---------- Stage 1: Build using full Maven image ----------
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the rest of the source and build the app
COPY . .
RUN mvn clean package -DskipTests


# ---------- Stage 2: Run using lightweight OpenJDK ----------
FROM openjdk:21-jdk

WORKDIR /app

# Copy built JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Set environment variable for port (optional)
EXPOSE 5455

# Run the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
