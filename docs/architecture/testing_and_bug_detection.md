# Testing and Bug Detection Framework

## 1. Automated Testing System

Our testing strategy balances rapid feedback with comprehensive system-level validation.

### Testing Layers:
1. **Unit Tests (JUnit 5 + Mockito)**
   - Target: Services, Controllers, Utilities.
   - Execution: Every commit.
   - Goal: Validate isolated business logic.

2. **Integration Tests (Spring Boot Test + TestContainers)**
   - Target: Repositories, Kafka Producers/Consumers, Redis caching.
   - Execution: Nightly / PR creation.
   - Tooling: `TestContainers` spins up ephemeral PostgreSQL, Redis, and Kafka Docker containers to test against real infrastructure securely.

3. **API Tests (REST Assured)**
   - Target: End-to-end endpoint validation including security rules.
   - Validates JSON schemas and status codes.

4. **Load Tests (Gatling / JMeter)**
   - Target: Messaging APIs, Feed generation, Wallet transactions.
   - Execution: Pre-release.
   - Goal: Ensure SLAs are met (e.g., 500k concurrent WebSockets).

## 2. Automatic Bug Detection

To ensure high availability and self-healing:

### Exception Tracking
- **Sentry Integration**: Global `@ControllerAdvice` in Spring Boot captures all unhandled exceptions and forwards stack traces to Sentry. Includes user context and request IDs.

### Centralized Logging
- **ELK Stack (Elasticsearch, Logstash, Kibana)**: All microservices log to stdout in JSON format. Filebeat/Logstash ships logs to ES.
- **Correlation IDs**: `Sleuth` and `Micrometer Tracing` automatically inject `traceId` and `spanId` into MDC (Mapped Diagnostic Context). Every log associated with a single user action can be traced across Gateway -> App -> Database.

### Resiliency Patterns
- **Automatic Retry Logic**: `@Retryable` annotations on external API calls and transient database failures (deadlocks).
- **Circuit Breakers (Resilience4j)**: Protects the system from cascading failures if a downstream service (like payment provider) is down.

### Health Checks & Monitoring
- **Spring Boot Actuator**: Exposes `/actuator/health`, `/actuator/metrics`, `/actuator/prometheus`.
- **Kubernetes Probes**: Liveness and Readiness probes linked to Actuator endpoints.
- **Grafana Alerts**: Alerts configured for:
  - Error rate > 1%
  - CPU/Memory sustained > 85%
  - Kafka consumer lag > threshold 
  - API p99 Latency > 500ms
