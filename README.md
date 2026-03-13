# WITS - World Interactive Trading & Social Platform (SuperApp)

WITS is a comprehensive, multi-module "SuperApp" built using Spring Boot, Vaadin, and Capacitor. It combines real-time messaging, social networking, e-commerce, digital wallets, and AI-driven features into a single, seamless ecosystem.

## 🚀 Overview

WITS (World Interactive Trading & Social) is designed to be more than just a chat application. It's a platform that integrates social connectivity with financial utility and AI intelligence. Whether you're chatting with friends, managing a community server, exploring a social feed, or using integrated mini-apps, WITS provides a unified experience.

## ✨ Key Features

### 💬 Communication & Community
- **Real-time Chat**: Individual and group messaging powered by WebSockets.
- **Servers & Channels**: Discord-style community servers with granular management and settings.
- **Group Management**: Advanced controls for group creators and admins.

### 📱 Social Ecosystem
- **Dynamic Social Feed**: Share updates, photos, and interact with the community.
- **Snap Map**: Discover users and events around you with location-based discovery.
- **Profiles**: Fully customizable user profiles with social stats and activity history.

### 🎮 Mini-Apps & Games Hub
- **Integrated Hub**: A dedicated space for mini-games and utility mini-apps.
- **Sandboxed Execution**: Safe environment for running third-party or internal mini-apps.

### 💰 Finance & Commerce
- **Digital Wallet**: Securely manage your digital assets and transactions.
- **Storefront**: Integrated e-commerce marketplace for physical or digital products.

### 🤖 AI Integration
- **Internal AI Features**: Leverages Spring AI for intelligent chat assistance, content moderation, or discovery patterns.

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.4
- **Security**: Spring Security (JWT-based)
- **Database**: 
  - **PostgreSQL** (Relational data, User accounts, Transactions)
  - **MongoDB** (Chat messages, Feeds, Metadata)
- **AI**: Spring AI (OpenAI-compatible)
- **Real-time**: Spring WebSockets
- **Organization**: Spring Modulith for clear architectural boundaries.

### Frontend
- **Web Interface**: Vaadin 24.3.6 (Java-based UI components)
- **Mobile Integration**: Capacitor 8.2.0 (for Android/iOS builds)
- **Client Logic**: Lit, TypeScript, Vite

### Infrastructure
- **Cloud Storage**: AWS S3 integration for media uploads.
- **Containerization**: Docker & Docker Compose support.
- **Native Support**: GraalVM Native Image readiness.

## 📦 Project Structure

```text
WITS/
├── android/             # Android Native/Capacitor project
├── api-gateway/         # Microservices API Gateway
├── src/main/java/       # Core Spring Boot Application
│   ├── controller/      # REST Endpoints (AI, CRM, Wallet, etc.)
│   ├── model/           # Data Entities
│   ├── view/            # Vaadin Web Components & Layouts
│   └── security/        # Auth & Security configuration
├── frontend/            # Vaadin frontend resources
├── docker-compose.yml   # Infrastructure setup
└── pom.xml              # Maven dependencies
```

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js & npm (for frontend builds)
- Docker (optional, for DB services)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/krishna3163/WITS.git
   ```
2. Navigate to the project directory:
   ```bash
   cd WITS
   ```
3. Run the infrastructure services (PostgreSQL, MongoDB):
   ```bash
   docker-compose up -d
   ```
4. Build and run the application:
   ```bash
   mvn spring-boot:run
   ```

## 📱 Mobile Build (Android)
To build the Android APK:
1. Ensure Android Studio is installed.
2. Run Capacitor sync:
   ```bash
   npx cap sync android
   ```
3. Open the `android` folder in Android Studio and build the APK.

## 📄 License
This project is [UNLICENSED](LICENSE).
