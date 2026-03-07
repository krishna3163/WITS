# Deployment Configuration

## Container Deployment Overview
The entire Super-App backend is container-native, designed to run on orchestrated environments (Kubernetes/EKS).

### 1. Dockerization
Every microservice includes a `Dockerfile` utilizing multi-stage builds and GraalVM native images (where applicable for cold-start performance).

```dockerfile
# Example multi-stage Dockerfile
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 2. CI/CD Pipeline (GitHub Actions / GitLab CI)
- **Commit Phase**: Run Unit Tests, check Checkstyle/SonarQube.
- **Build Phase**: Compile JAR, build Docker Image, push to Container Registry (ECR/GCR).
- **Deploy Phase**: Update Kubernetes manifests (via ArgoCD), trigger rolling update on clusters.

### 3. Environment Variables & Secrets Management
- Application configuration is externalized via **Spring Cloud Config**.
- Secrets (DB passwords, API keys, JWT Secrets) are stored in **HashiCorp Vault** or **AWS Secrets Manager**, injected directly into the containers at runtime. Avoid hardcoding in `application.yml`.

### 4. Horizontal Scaling
- **Stateless Services**: All auth, feed, and user services are stateless and driven by Kubernetes HPA (Horizontal Pod Autoscaler) targeting 70% CPU usage.
- **WebSockets (Messaging)**: Sticky sessions or redis-backed pub/sub routing to scale WebSocket nodes (already handled seamlessly by InsForge Realtime).
- **Database Sharding**: InsForge Postgres allows read-replicas for heavy query loads.

### 5. Infrastructure as Code
Provisioning is abstracted using Terraform, defining:
- VPCs and Subnets.
- Managed Kafka (MSK) clusters.
- Redis clusters (ElastiCache).
- EKS (Kubernetes) Node Groups.
