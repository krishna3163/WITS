# Super App Database Architecture Design 🗄️

To support a WeChat-scale Super App with Spring Boot Microservices and an InsForge BaaS foundation, the database needs to be properly normalized across distinct business domains. 

A full-scale system will require **70-90 tables**. Below is the roadmap grouping the tables logically by domain, and the core physical schema implemented in InsForge.

---

## Domain 1: Identity & Social Graph (User Service)
1. `profiles` (Extends Auth with display name, avatar, bio)
2. `user_settings` (Theme, language, global privacy)
3. `devices` (Active sessions, push tokens)
4. `contacts` (The social graph edge table)
5. `contact_requests` (Pending approvals)
6. `blocklist`
7. `close_friends` (For tiered sharing)

## Domain 2: Core Messaging (Chat Service)
8. `conversations` (1-on-1 and Groups)
9. `conversation_participants` (Members and Roles)
10. `messages` (Text, Images, Voice, Video, Files)
11. `message_reads` (Read receipt tracking)
12. `message_reactions` (Emojis on messages)
13. `attachments` (Media metadata and S3 pointers)
14. `pinned_messages`
15. `chat_folders` (E.g. "Work", "Family")

## Domain 3: Super Groups & Channels (Group Service)
16. `channels` (Broadcast groups)
17. `channel_subscribers`
18. `channel_roles` (Custom RBAC per group)
19. `channel_messages`
20. `group_invites` (Shareable links)

## Domain 4: Social Feed / Moments (Feed Service)
21. `posts` (The core feed entry)
22. `post_media` (Gallery bounds for a post)
23. `post_likes` 
24. `post_comments`
25. `comment_likes`
26. `post_visibility_rules` (Who can see this specific moment)
27. `stories` (Ephemeral 24h posts)
28. `story_views`

## Domain 5: Wallet & Payments (Wallet Service)
29. `wallets` (Core ledger)
30. `transactions` (Transfers, Miniapp purchases)
31. `payment_methods` (Saved credit cards, linked banks)
32. `qr_codes` (For receive/pay flows)
33. `withdrawal_requests`
34. `merchant_accounts` (For business profiles)

## Domain 6: Mini-App Ecosystem (Miniapp Service)
35. `miniapps` (Registry of apps)
36. `miniapp_versions` (Release management)
37. `user_installations` (User's app drawer)
38. `miniapp_permissions` (Camera, Location, Wallet access limits)
39. `miniapp_analytics_events`

## Domain 7: Global Notifications (Notification Service)
40. `notifications` (In-app alert hub)
41. `notification_preferences` (Mute specific chats/apps)
42. `push_dispatch_logs` (Delivery tracking)

## Domain 8: Search & AI Subsystem
43. `search_indexes`
44. `ai_chat_sessions`
45. `ai_agent_personas`

---

## 🚀 Phase 1: Core Physical Schema Initialization

The following core subset of these tables has been physically initialized into the InsForge PostgreSQL instance to establish the foundational foreign-key relationships. Your Spring Boot JPA Entities (`User.java`, `Message.java`, etc.) will map directly to these tables.

*See `db/01_core_schema.sql` for the executed DDL statements.*
