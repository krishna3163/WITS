# WITS - World Interactive Trading & Social Platform (SuperApp)

[![Build Status](https://github.com/krishna3163/WITS/actions/workflows/build.yml/badge.svg)](https://github.com/krishna3163/WITS/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

WITS is a next-generation, multi-module **SuperApp** designed to unify communication, social networking, commerce, and finance into a single ecosystem. Built with a high-performance Java/Spring Boot backend and a cross-platform Capacitor frontend, WITS provides a seamless experience across Web, Android, iOS, Windows, macOS, and Linux.

---

## 🤖 AI-Agent Developer Quickstart

> [!IMPORTANT]
> **To the AI Developer:** This project uses a **Modular Monolith** architecture (Spring Modulith). Each domain (Wallet, Chat, Feed, etc.) is highly encapsulated.
> - **Entry Point**: `src/main/java/com/message/chat/WITS/WitsApplication.java`
> - **Core Logic**: Services in `src/main/java/com/message/chat/WITS/service/` drive the high-level features.
> - **UI Layer**: Vaadin views in `src/main/java/com/message/chat/WITS/view/` handle the reactive web interface.
> - **SuperApp Core**: `SuperAppService.java` is the primary orchestrator for mini-apps and transactions.

---

## ✨ Features & Behavior in Detail

### 1. 💬 Hyper-Connected Messaging
- **Real-Time Engine**: WebSocket-based messaging for instantaneous delivery.
- **Discord-Style Servers**: Create and join communities with specific channels (text, media, announcements).
- **Advanced Group Controls**: Roles, permissions, and management views for community moderators.
- **Media Sharing**: Integrated AWS S3-backed media upload and viewing.

### 2. 💰 Financial SuperApp Features (`SuperAppService`)
- **Digital Wallet**: Native wallet for every user with currency support (default: USD).
- **P2P Payments**: Send and receive money instantly between users.
- **QR Code Payments**: Scan-to-pay functionality using unique wallet tokens.
- **Bill Splitting**: Create group bills, automatically calculate shares, and track payment status.
- **Storefront**: Browse products and pay directly using your WITS wallet balance.

### 3. 📱 Social Ecosystem
- **Interactive Feed**: A high-fidelity social timeline with posting, liking, and commenting capabilities.
- **Snap Map**: Geospatial discovery to find friends, local events, or popular spots.
- **Privacy First**: Granular privacy settings for profile visibility and location sharing.

### 4. 🎮 Mini-App Sandbox
- **Extensible Hub**: A dedicated marketplace for mini-games and utility apps (Taxi, Shopping, etc.).
- **Dynamic Registration**: New mini-apps can be registered and rendered instantly within the WITS container.
- **Unified Auth**: Single sign-on for all internal mini-services.

---

## 🛠 Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Spring Boot 3.2.4, Spring Security, Spring Modulith |
| **Persistence** | PostgreSQL (Relational), MongoDB (Document/NoSQL) |
| **AI Integration** | Spring AI (OpenAI/Cloud compatible) |
| **Web Frontend** | Vaadin 24.3.x, Lit, TypeScript, Vite |
| **Mobile/Desktop** | Capacitor 8.2.0, Electron, iOS Native, Android Native |
| **Infrastructure** | Docker, AWS S3, GitHub Actions |

---

## 🛠 Development & Contribution

WITS is designed to be **Contribution Friendly**. We welcome builders, designers, and AI agents.

### Prerequisites
- **Java 17+** & **Maven 3.8+**
- **Node.js 18+** & **npm**
- **Docker** (for database services)

### Local Setup
1.  **Clone & Install**:
    ```bash
    git clone https://github.com/krishna3163/WITS.git
    cd WITS
    npm install
    ```
2.  **Start Services**:
    ```bash
    docker-compose up -d
    ```
3.  **Run Backend**:
    ```bash
    mvn spring-boot:run
    ```
4.  **Frontend (Optional manual build)**:
    ```bash
    cd frontend-react && npm run build
    ```

### How to Contribute
- **Domain Experts**: Focus on specific services in `src/main/java/.../service/`.
- **UI/UX Designers**: Contribute to Vaadin views or the React-based frontend modules.
- **AI Agents**: When adding features, ensure you follow the existing service-repository pattern. Always update the `HELP.md` or `README.md` if you introduce new architectural concepts.

---

## 🏗 Build Automation (CI/CD)

The project includes a **Multi-Platform Build Pipeline** via GitHub Actions.
- **Artifacts Generated**:
  - `Android`: .apk (Debug/Release)
  - `Windows`: .exe (Installer)
  - `macOS`: .dmg / .app
  - `Linux`: .AppImage / .deb
- **Workflow Path**: `.github/workflows/build.yml`

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Roadmap
- [ ] Implement End-to-End Encryption (E2EE) for secret chats.
- [ ] Expand AI discovery engine for better "Snap Map" suggestions.
- [ ] Integrate real-time audio spaces/voice channels.
- [ ] Full Marketplace for third-party mini-app developers.
