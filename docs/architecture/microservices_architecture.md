# Super-App Microservices Architecture

## Overview
The platform runs on InsForge BaaS infrastructure with a Java Spring Boot microservices layer. It is designed to scale horizontally to support millions of users, implementing the WeChat-style super-app ecosystem.

## Target Architecture

### 1. Client Applications
- Android (Kotlin/Jetpack Compose)
- iOS (Swift/SwiftUI)
- Web (React/Next.js)

### 2. API Gateway (Spring Cloud Gateway)
- **Routing**: Routes traffic to appropriate microservices.
- **Authentication**: Validates JWTs before forwarding requests.
- **Rate Limiting**: Protects against DDoS and abuse.
- **Security Headers & Logging**.

### 3. Microservices Layer (Java Spring Boot)
Each service is containerized (Docker), independently deployable, and communicates via REST/gRPC and event streams (Kafka/RabbitMQ).

1. **User Service**: Profile management, privacy settings, online status.
2. **Auth Service**: Registration, JWT login, OAuth, 2FA.
3. **Messaging Service**: Real-time chat (WebSocket over InsForge Realtime), offline storage.
4. **Group & Community Service**: Group hierarchies, permissions, topics.
5. **Feed / Moments Service**: Social feed, media posts, interaction tracking.
6. **Notification Service**: APNs/FCM pushes, emails.
7. **Media Service**: S3/InsForge Object Storage uploads (chunked), CDN integration.
8. **Payment & Wallet Service**: Wallet ledgers, transactions, QR pay.
9. **Mini App Platform Service**: App Store, developer portal, permissions sandbox.
10. **Search Service**: ElasticSearch-backed global indexing.
11. **Analytics Service**: System metrics, user behavior tracking.

### 4. Infrastructure Layer
- **InsForge PostgreSQL**: Primary normalized relational storage.
- **Redis**: Caching layer, session storage, distributed locks.
- **Kafka / RabbitMQ**: Event broker for cross-service communication (e.g., `message.sent`, `payment.completed`).
- **ElasticSearch**: Full-text searching engine.

### 5. Storage Layer
- **InsForge Object Storage (S3-compatible)**: For storing media, bundles, avatars.
- **CDN**: Cloudflare / AWS CloudFront.

### 6. Monitoring & Bug Detection Layer
- **Centralized Logging**: ELK stack (ElasticSearch, Logstash, Kibana).
- **Metrics**: Prometheus & Grafana.
- **Tracing**: Zipkin / Jaeger.
- **Exception Tracking**: Sentry.

## Event Messaging System
Services communicate asynchronously to avoid tight coupling.
- When `messaging-service` handles a new message -> publishes `message.sent` to Kafka.
- `notification-service` listens to `message.sent` -> triggers Push Notification.
- `feed-service` listens to `post.created` -> updates timelines.
