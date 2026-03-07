# Dockerfile for WITS Chat application

# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
COPY frontend ./frontend
COPY package.json ./
COPY package-lock.json ./
COPY vite.config.ts ./
COPY tsconfig.json ./
# Download dependencies
RUN mvn dependency:go-offline
# Build application (skip tests for faster build)
RUN mvn clean package -Pproduction -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/WITS-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]