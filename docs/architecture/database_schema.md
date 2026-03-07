# Database Schema (Normalized InsForge PostgreSQL)

## Core Tables

### Users & Profiles
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    username VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    last_seen TIMESTAMP WITH TIME ZONE,
    settings JSONB DEFAULT '{}'
);

CREATE TABLE friends (
    user_id_1 UUID REFERENCES users(id),
    user_id_2 UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, ACCEPTED, BLOCKED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id_1, user_id_2)
);
```

### Messaging & Groups
```sql
CREATE TABLE chat_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'BASIC', -- BASIC, SUPER_GROUP, COMMUNITY
    description TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE group_members (
    group_id UUID REFERENCES chat_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'MEMBER', -- OWNER, ADMIN, MODERATOR, MEMBER
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (group_id, user_id)
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    group_id UUID REFERENCES chat_groups(id) ON DELETE CASCADE, -- NULL for DMs
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,   -- NULL for Groups
    content TEXT,
    message_type VARCHAR(50) DEFAULT 'TEXT', -- TEXT, IMAGE, VIDEO, PAYMENT, MINIAPP
    media_url TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_messages_group ON messages(group_id, created_at);
CREATE INDEX idx_messages_dm ON messages(sender_id, recipient_id, created_at);
```

### Feed / Moments
```sql
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT,
    media_urls JSONB,
    post_type VARCHAR(50) DEFAULT 'TEXT',
    engagement_score INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id UUID NOT NULL, -- post_id or message_id
    target_type VARCHAR(50), -- POST, MESSAGE
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reaction VARCHAR(50)
);
```

### Wallet & Payments
```sql
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    balance DECIMAL(15, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_wallet_id UUID REFERENCES wallets(id),
    receiver_wallet_id UUID REFERENCES wallets(id),
    amount DECIMAL(15, 2) NOT NULL,
    type VARCHAR(50) , -- P2P, MERCHANT, RED_PACKET
    status VARCHAR(50) DEFAULT 'PENDING', -- SUCCESS, FAILED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Mini Apps
```sql
CREATE TABLE mini_apps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    developer_id UUID REFERENCES users(id),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    bundle_url TEXT NOT NULL,
    version VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING', -- PUBLISHED, BLOCKED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE mini_app_permissions (
    app_id UUID REFERENCES mini_apps(id) ON DELETE CASCADE,
    permission VARCHAR(100), -- GET_USER_INFO, MAKE_PAYMENT, OPEN_CHAT
    PRIMARY KEY (app_id, permission)
);

CREATE TABLE mini_app_installs (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    app_id UUID REFERENCES mini_apps(id) ON DELETE CASCADE,
    installed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, app_id)
);
```
