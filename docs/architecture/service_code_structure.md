# Application Code Structure

## Project Scaffold
As the project transitions from a monolith to a microservices architecture, the codebase will be split into multi-module Maven projects or separate repositories.

```text
superapp-backend/
├── pom.xml (Parent POM)
│
├── api-gateway/
│   ├── src/main/java/com/superapp/gateway/
│   │   ├── config/       (Security, Rate Limiting, Routes)
│   │   └── GatewayApplication.java
│
├── auth-service/
│   ├── src/main/java/com/superapp/auth/
│   │   ├── controller/   (Auth endpoints)
│   │   ├── service/      (JWT, OAuth logic)
│   │   ├── security/     (Bcrypt, Token config)
│   │   └── dto/          (Login/Register requests)
│
├── user-service/
│   ├── src/main/java/com/superapp/user/
│   │   ├── controller/   (UserController, FriendController)
│   │   ├── service/      (UserServiceImpl)
│   │   ├── repository/   (Spring Data JPA / InsForge)
│   │   ├── model/        (User entity)
│   │   ├── dto/
│   │   └── config/
│
├── messaging-service/
│   ├── src/main/java/com/superapp/messaging/
│   │   ├── controller/   (Message REST API)
│   │   ├── websocket/    (WebSocket / InsForge Realtime hooks)
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   └── kafka/        (Event producers/consumers)
│
├── miniapp-service/
│   ├── src/main/java/com/superapp/miniapp/
│   │   ├── controller/   (Store, Developer APIs)
│   │   ├── service/      (Validation, Publishing logic)
│   │   ├── model/        (MiniApp, InstalledApp, Permission)
│   │   └── security/     (Sandbox API validators)
│
└── payment-service/
    ├── src/main/java/com/superapp/payment/
        ├── controller/
        ├── service/      (Ledger balance, transactions)
        ├── repository/
        └── model/        (Wallet, Transaction)
```

## Spring Boot Best Practices
- **Controllers**: Thin layer, handles HTTP routing, DTO mapping, and basic validation.
- **Services**: Business logic. No direct HTTP request objects. Transactional boundaries (`@Transactional`).
- **Repositories**: Standard Spring Data interfaces mapping to InsForge PostgreSQL.
- **DTOs**: Strict separation between Database Models and API DTOs using MapStruct.
- **Security**: Method-level security (`@PreAuthorize`), validated by JWT scopes.
