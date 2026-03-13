-- ============================================================
-- WITS SUPER-APP: COMPREHENSIVE POSTGRESQL SCHEMA
-- Migration-ready for InsForge PostgreSQL
-- Extends 01_core_schema.sql (profiles, contacts, conversations,
-- conversation_participants, messages, posts, post_media,
-- post_comments, wallets, transactions, miniapps, user_miniapps)
-- ============================================================

-- MODULE 1: USER IDENTITY SYSTEM
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    language VARCHAR(10) DEFAULT 'en',
    theme VARCHAR(20) DEFAULT 'system',
    font_size VARCHAR(10) DEFAULT 'medium',
    notification_sound BOOLEAN DEFAULT TRUE,
    auto_download_media BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_privacy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    profile_visibility VARCHAR(20) DEFAULT 'everyone',
    last_seen_visibility VARCHAR(20) DEFAULT 'everyone',
    read_receipts BOOLEAN DEFAULT TRUE,
    online_status BOOLEAN DEFAULT TRUE,
    allow_friend_requests BOOLEAN DEFAULT TRUE,
    allow_group_invites BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info TEXT,
    ip_address VARCHAR(45),
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_user_sessions_user ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON public.user_sessions(token_hash);

CREATE TABLE IF NOT EXISTS public.user_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    device_name VARCHAR(255),
    device_type VARCHAR(50),
    os_version VARCHAR(100),
    app_version VARCHAR(50),
    push_token TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_active_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_user_devices_user ON public.user_devices(user_id);

CREATE TABLE IF NOT EXISTS public.user_security (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    password_hash VARCHAR(255),
    password_changed_at TIMESTAMPTZ,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMPTZ,
    security_question TEXT,
    security_answer_hash VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_two_factor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    method VARCHAR(20) DEFAULT 'totp',
    secret_key VARCHAR(255),
    is_enabled BOOLEAN DEFAULT FALSE,
    backup_codes TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_login_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    login_method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'success',
    location VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_login_history_user ON public.user_login_history(user_id);
CREATE INDEX idx_login_history_created ON public.user_login_history(created_at);

CREATE TABLE IF NOT EXISTS public.user_blocked_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    blocked_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, blocked_user_id)
);

CREATE TABLE IF NOT EXISTS public.user_verification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    verification_type VARCHAR(50),
    token VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    status_text VARCHAR(255),
    status_emoji VARCHAR(10),
    is_online BOOLEAN DEFAULT FALSE,
    last_seen_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    resource VARCHAR(100),
    action VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_role_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.user_roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES public.user_roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.user_permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

-- MODULE 2: CONTACTS AND SOCIAL GRAPH
CREATE TABLE IF NOT EXISTS public.contact_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(sender_id, receiver_id)
);

CREATE TABLE IF NOT EXISTS public.contact_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.contact_groups(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(group_id, contact_id)
);

CREATE TABLE IF NOT EXISTS public.contact_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    tag VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_imports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    source VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    total_contacts INT DEFAULT 0,
    imported_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_sync (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider VARCHAR(50),
    last_sync_at TIMESTAMPTZ,
    sync_token TEXT,
    status VARCHAR(20) DEFAULT 'idle',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_block_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    blocked_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, blocked_id)
);

CREATE TABLE IF NOT EXISTS public.contact_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, contact_id)
);

CREATE TABLE IF NOT EXISTS public.contact_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_type VARCHAR(50),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_mutuals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    mutual_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    suggested_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason VARCHAR(100),
    score FLOAT DEFAULT 0,
    is_dismissed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MODULE 3: MESSAGING SYSTEM (extends conversations/messages)
CREATE TABLE IF NOT EXISTS public.conversation_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversation_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID UNIQUE REFERENCES public.conversations(id) ON DELETE CASCADE,
    mute_notifications BOOLEAN DEFAULT FALSE,
    auto_delete_after INT,
    allow_media BOOLEAN DEFAULT TRUE,
    allow_links BOOLEAN DEFAULT TRUE,
    max_members INT DEFAULT 500,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversation_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversation_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    invited_by UUID REFERENCES public.profiles(id),
    invited_user_id UUID REFERENCES public.profiles(id),
    invite_code VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversation_archives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    archived_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversation_pins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    pinned_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.conversation_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_muted BOOLEAN DEFAULT FALSE,
    mute_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.message_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.message_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    media_type VARCHAR(50),
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    file_size BIGINT,
    duration INT,
    width INT,
    height INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.message_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    emoji VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(message_id, user_id, emoji)
);

CREATE TABLE IF NOT EXISTS public.message_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.message_edits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    old_content TEXT,
    new_content TEXT,
    edited_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.message_forward (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
    forwarded_message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    forwarded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.message_mentions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    mentioned_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.message_read_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(message_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.message_delivery_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'sent',
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.message_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    flag_type VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.message_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES public.profiles(id),
    reason VARCHAR(100),
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.message_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    reply_count INT DEFAULT 0,
    last_reply_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.message_scheduled (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id),
    content TEXT,
    media_url TEXT,
    scheduled_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.message_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.message_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name VARCHAR(100),
    content TEXT NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.message_translation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    source_language VARCHAR(10),
    target_language VARCHAR(10),
    translated_content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.message_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    file_name VARCHAR(255),
    file_url TEXT NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_created ON public.messages(created_at);

-- MODULE 4: GROUPS AND COMMUNITIES
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    avatar_url TEXT,
    creator_id UUID REFERENCES public.profiles(id),
    is_public BOOLEAN DEFAULT FALSE,
    max_members INT DEFAULT 500,
    member_count INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID UNIQUE REFERENCES public.groups(id) ON DELETE CASCADE,
    join_approval BOOLEAN DEFAULT FALSE,
    allow_member_invite BOOLEAN DEFAULT TRUE,
    allow_media BOOLEAN DEFAULT TRUE,
    slow_mode_seconds INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    nickname VARCHAR(100),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.group_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(20),
    permissions JSONB DEFAULT '{}',
    position INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.group_roles(id) ON DELETE CASCADE,
    permission VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    invited_by UUID REFERENCES public.profiles(id),
    invited_user_id UUID REFERENCES public.profiles(id),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_invite_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    max_uses INT,
    use_count INT DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_invite_qr (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    invite_link_id UUID REFERENCES public.group_invite_links(id) ON DELETE CASCADE,
    qr_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES public.profiles(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES public.profiles(id),
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_multiple_choice BOOLEAN DEFAULT FALSE,
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_poll_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID REFERENCES public.group_polls(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    option_index INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id),
    title VARCHAR(255),
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    rule_number INT,
    title VARCHAR(255),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    uploader_id UUID REFERENCES public.profiles(id),
    media_type VARCHAR(50),
    media_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    uploader_id UUID REFERENCES public.profiles(id),
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    activity_type VARCHAR(50),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    action VARCHAR(100),
    actor_id UUID REFERENCES public.profiles(id),
    target_id UUID REFERENCES public.profiles(id),
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES public.profiles(id),
    reason VARCHAR(100),
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_bans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    banned_by UUID REFERENCES public.profiles(id),
    reason TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_muted_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    muted_by UUID REFERENCES public.profiles(id),
    mute_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MODULE 5: SOCIAL FEED (extends posts)
CREATE TABLE IF NOT EXISTS public.post_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.post_visibility (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID UNIQUE REFERENCES public.posts(id) ON DELETE CASCADE,
    visibility VARCHAR(20) DEFAULT 'public',
    allowed_users UUID[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.post_comment_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.post_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.post_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    share_type VARCHAR(20) DEFAULT 'repost',
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.post_mentions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    mentioned_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.post_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    tag VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_post_tags_tag ON public.post_tags(tag);

CREATE TABLE IF NOT EXISTS public.post_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID UNIQUE REFERENCES public.posts(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    place_name VARCHAR(255),
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.post_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES public.profiles(id),
    reason VARCHAR(100),
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.post_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.post_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.post_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT,
    media_urls TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.post_edits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    old_content TEXT,
    new_content TEXT,
    edited_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.post_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    version INT DEFAULT 1,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stories
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT,
    background_color VARCHAR(20),
    font_style VARCHAR(50),
    expires_at TIMESTAMPTZ,
    view_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.story_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
    media_type VARCHAR(50),
    media_url TEXT NOT NULL,
    duration INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.story_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(story_id, viewer_id)
);

CREATE TABLE IF NOT EXISTS public.story_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.story_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    emoji VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.story_highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(100),
    cover_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.story_highlight_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    highlight_id UUID REFERENCES public.story_highlights(id) ON DELETE CASCADE,
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
    position INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.story_archives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.story_music (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
    track_name VARCHAR(255),
    artist VARCHAR(255),
    audio_url TEXT,
    start_time INT DEFAULT 0,
    duration INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.story_effects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100),
    effect_type VARCHAR(50),
    config JSONB,
    preview_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.story_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100),
    preview_url TEXT,
    config JSONB,
    category VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MODULE 6: DISCOVER AND CONTENT
CREATE TABLE IF NOT EXISTS public.discover_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(20),
    position INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.discover_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    avatar_url TEXT,
    cover_url TEXT,
    category_id UUID REFERENCES public.discover_categories(id),
    owner_id UUID REFERENCES public.profiles(id),
    follower_count INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.discover_channel_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID REFERENCES public.discover_channels(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id),
    title VARCHAR(255),
    content TEXT,
    media_url TEXT,
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.discover_channel_followers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID REFERENCES public.discover_channels(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(channel_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.discover_trending (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type VARCHAR(50),
    content_id UUID,
    score FLOAT DEFAULT 0,
    trending_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.discover_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_url TEXT,
    organizer_id UUID REFERENCES public.profiles(id),
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    location TEXT,
    max_participants INT,
    is_online BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.discover_event_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.discover_events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'going',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.discover_event_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.discover_events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    ticket_type VARCHAR(50),
    price DECIMAL(10,2) DEFAULT 0,
    ticket_code VARCHAR(100) UNIQUE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.discover_search_index (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type VARCHAR(50),
    content_id UUID,
    title TEXT,
    body TEXT,
    tags TEXT[],
    search_vector TSVECTOR,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_discover_search_vector ON public.discover_search_index USING GIN(search_vector);

CREATE TABLE IF NOT EXISTS public.discover_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content_type VARCHAR(50),
    content_id UUID,
    score FLOAT DEFAULT 0,
    reason VARCHAR(100),
    is_dismissed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MODULE 7: MINI APP PLATFORM (extends miniapps)
CREATE TABLE IF NOT EXISTS public.miniapp_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    version VARCHAR(20) NOT NULL,
    changelog TEXT,
    bundle_url TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.miniapp_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    position INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.miniapp_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    permission VARCHAR(100) NOT NULL,
    is_required BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.miniapp_developers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    website VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.miniapp_installs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    version VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(miniapp_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.miniapp_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    session_start TIMESTAMPTZ DEFAULT NOW(),
    session_end TIMESTAMPTZ,
    duration_seconds INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.miniapp_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    action VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.miniapp_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(miniapp_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.miniapp_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID UNIQUE REFERENCES public.miniapps(id) ON DELETE CASCADE,
    avg_rating DECIMAL(3,2) DEFAULT 0,
    total_ratings INT DEFAULT 0,
    rating_1 INT DEFAULT 0,
    rating_2 INT DEFAULT 0,
    rating_3 INT DEFAULT 0,
    rating_4 INT DEFAULT 0,
    rating_5 INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.miniapp_revenue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    period_start DATE,
    period_end DATE,
    revenue DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'USD',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.miniapp_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    event_type VARCHAR(100),
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.miniapp_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    level VARCHAR(20) DEFAULT 'info',
    message TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.miniapp_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    error_type VARCHAR(100),
    message TEXT,
    stack_trace TEXT,
    user_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.miniapp_security (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    csp_policy TEXT,
    allowed_domains TEXT[],
    sandbox_mode BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.miniapp_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID UNIQUE REFERENCES public.miniapps(id) ON DELETE CASCADE,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.miniapp_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    asset_type VARCHAR(50),
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.miniapp_storage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    key VARCHAR(255) NOT NULL,
    value JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(miniapp_id, user_id, key)
);

CREATE TABLE IF NOT EXISTS public.miniapp_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    cache_key VARCHAR(255) NOT NULL,
    cache_value JSONB,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.miniapp_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    metric_name VARCHAR(100),
    metric_value DECIMAL(15,2),
    period DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MODULE 8: WALLET AND PAYMENTS (extends wallets/transactions)
CREATE TABLE IF NOT EXISTS public.wallet_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE,
    currency VARCHAR(10) NOT NULL,
    amount DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(wallet_id, currency)
);

CREATE TABLE IF NOT EXISTS public.wallet_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID UNIQUE REFERENCES public.wallets(id) ON DELETE CASCADE,
    daily_limit DECIMAL(15,2) DEFAULT 10000,
    monthly_limit DECIMAL(15,2) DEFAULT 100000,
    auto_topup BOOLEAN DEFAULT FALSE,
    default_currency VARCHAR(10) DEFAULT 'USD',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wallet_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE,
    limit_type VARCHAR(50),
    amount DECIMAL(15,2),
    period VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wallet_security (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID UNIQUE REFERENCES public.wallets(id) ON DELETE CASCADE,
    pin_hash VARCHAR(255),
    biometric_enabled BOOLEAN DEFAULT FALSE,
    transaction_notifications BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transaction_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transaction_status_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE,
    status VARCHAR(50),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transaction_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES public.transactions(id),
    direction VARCHAR(10),
    amount DECIMAL(15,2),
    balance_after DECIMAL(15,2),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transaction_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID UNIQUE REFERENCES public.transactions(id) ON DELETE CASCADE,
    receipt_number VARCHAR(100) UNIQUE,
    receipt_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transaction_refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES public.transactions(id),
    refund_amount DECIMAL(15,2),
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transaction_disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES public.transactions(id),
    disputer_id UUID REFERENCES public.profiles(id),
    reason TEXT,
    evidence_urls TEXT[],
    status VARCHAR(20) DEFAULT 'open',
    resolved_at TIMESTAMPTZ,
    resolution TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    method_type VARCHAR(50) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payment_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_method_id UUID REFERENCES public.payment_methods(id) ON DELETE CASCADE,
    card_last_four VARCHAR(4),
    card_brand VARCHAR(20),
    exp_month INT,
    exp_year INT,
    token VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payment_bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_method_id UUID REFERENCES public.payment_methods(id) ON DELETE CASCADE,
    bank_name VARCHAR(255),
    account_last_four VARCHAR(4),
    routing_number VARCHAR(20),
    account_type VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.merchant_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.merchant_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID UNIQUE REFERENCES public.merchant_accounts(id) ON DELETE CASCADE,
    logo_url TEXT,
    website VARCHAR(255),
    description TEXT,
    address TEXT,
    category VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.merchant_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES public.merchant_accounts(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES public.transactions(id),
    fee_amount DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(15,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.merchant_settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES public.merchant_accounts(id) ON DELETE CASCADE,
    amount DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'pending',
    settled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.merchant_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES public.merchant_accounts(id) ON DELETE CASCADE,
    rate DECIMAL(5,4) DEFAULT 0.029,
    flat_fee DECIMAL(5,2) DEFAULT 0.30,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.merchant_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES public.merchant_accounts(id) ON DELETE CASCADE,
    amount DECIMAL(15,2),
    bank_account_id UUID REFERENCES public.payment_bank_accounts(id),
    status VARCHAR(20) DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MODULE 9: NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255),
    body TEXT,
    notification_type VARCHAR(50),
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_created ON public.notifications(created_at);

CREATE TABLE IF NOT EXISTS public.notification_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    template TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notification_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    notification_type VARCHAR(50),
    push_enabled BOOLEAN DEFAULT TRUE,
    email_enabled BOOLEAN DEFAULT FALSE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    in_app_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100),
    subject VARCHAR(255),
    body_template TEXT,
    channel VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notification_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100),
    source_type VARCHAR(50),
    source_id UUID,
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notification_delivery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID REFERENCES public.notifications(id) ON DELETE CASCADE,
    channel VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending',
    delivered_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notification_push (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID REFERENCES public.notifications(id) ON DELETE CASCADE,
    device_token TEXT,
    platform VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notification_email (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID REFERENCES public.notifications(id) ON DELETE CASCADE,
    to_email VARCHAR(255),
    subject VARCHAR(255),
    body TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notification_sms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID REFERENCES public.notifications(id) ON DELETE CASCADE,
    phone_number VARCHAR(20),
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID REFERENCES public.notifications(id) ON DELETE CASCADE,
    action VARCHAR(50),
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MODULE 10: MEDIA STORAGE
CREATE TABLE IF NOT EXISTS public.media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uploader_id UUID REFERENCES public.profiles(id),
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    mime_type VARCHAR(100),
    bucket VARCHAR(100),
    storage_path TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_media_files_uploader ON public.media_files(uploader_id);

CREATE TABLE IF NOT EXISTS public.media_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_file_id UUID REFERENCES public.media_files(id) ON DELETE CASCADE,
    width INT,
    height INT,
    format VARCHAR(20),
    has_transparency BOOLEAN DEFAULT FALSE,
    exif_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.media_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_file_id UUID REFERENCES public.media_files(id) ON DELETE CASCADE,
    width INT,
    height INT,
    duration INT,
    codec VARCHAR(50),
    bitrate INT,
    fps FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.media_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_file_id UUID REFERENCES public.media_files(id) ON DELETE CASCADE,
    page_count INT,
    doc_format VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.media_audio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_file_id UUID REFERENCES public.media_files(id) ON DELETE CASCADE,
    duration INT,
    bitrate INT,
    sample_rate INT,
    channels INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.media_thumbnails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_file_id UUID REFERENCES public.media_files(id) ON DELETE CASCADE,
    thumbnail_url TEXT NOT NULL,
    width INT,
    height INT,
    size_label VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.media_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_file_id UUID UNIQUE REFERENCES public.media_files(id) ON DELETE CASCADE,
    metadata JSONB DEFAULT '{}',
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.media_transcoding_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_file_id UUID REFERENCES public.media_files(id) ON DELETE CASCADE,
    target_format VARCHAR(50),
    target_quality VARCHAR(20),
    status VARCHAR(20) DEFAULT 'queued',
    output_url TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.media_processing_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_file_id UUID REFERENCES public.media_files(id) ON DELETE CASCADE,
    operation VARCHAR(100),
    status VARCHAR(20),
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MODULE 11: ANALYTICS AND METRICS
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id),
    event_name VARCHAR(100) NOT NULL,
    event_category VARCHAR(50),
    properties JSONB,
    session_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_analytics_events_user ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_name ON public.analytics_events(event_name);
CREATE INDEX idx_analytics_events_created ON public.analytics_events(created_at);

CREATE TABLE IF NOT EXISTS public.analytics_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id),
    session_token VARCHAR(100),
    device_type VARCHAR(50),
    os VARCHAR(50),
    browser VARCHAR(50),
    ip_address VARCHAR(45),
    country VARCHAR(10),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration_seconds INT,
    page_views INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.analytics_user_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_date DATE DEFAULT CURRENT_DATE,
    messages_sent INT DEFAULT 0,
    posts_created INT DEFAULT 0,
    likes_given INT DEFAULT 0,
    time_spent_seconds INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, activity_date)
);

CREATE TABLE IF NOT EXISTS public.analytics_message_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stat_date DATE DEFAULT CURRENT_DATE,
    total_messages BIGINT DEFAULT 0,
    total_media_messages BIGINT DEFAULT 0,
    active_conversations BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.analytics_post_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stat_date DATE DEFAULT CURRENT_DATE,
    total_posts BIGINT DEFAULT 0,
    total_likes BIGINT DEFAULT 0,
    total_comments BIGINT DEFAULT 0,
    total_shares BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.analytics_payment_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stat_date DATE DEFAULT CURRENT_DATE,
    total_transactions BIGINT DEFAULT 0,
    total_volume DECIMAL(20,2) DEFAULT 0,
    avg_transaction DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.analytics_miniapp_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    stat_date DATE DEFAULT CURRENT_DATE,
    opens INT DEFAULT 0,
    unique_users INT DEFAULT 0,
    avg_session_seconds INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.analytics_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    error_type VARCHAR(100),
    error_message TEXT,
    stack_trace TEXT,
    user_id UUID REFERENCES public.profiles(id),
    context JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.analytics_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level VARCHAR(20) DEFAULT 'info',
    service VARCHAR(100),
    message TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.analytics_dashboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES public.profiles(id),
    config JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MODULE 12: SYSTEM CONFIGURATION
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB,
    description TEXT,
    category VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.system_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    config JSONB DEFAULT '{}',
    environment VARCHAR(20) DEFAULT 'production',
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.system_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    rollout_percentage INT DEFAULT 100,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.system_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.system_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    permissions TEXT[],
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level VARCHAR(20) DEFAULT 'info',
    source VARCHAR(100),
    message TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_system_logs_created ON public.system_logs(created_at);

CREATE TABLE IF NOT EXISTS public.system_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    error_code VARCHAR(50),
    message TEXT,
    stack_trace TEXT,
    severity VARCHAR(20) DEFAULT 'error',
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.system_audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_audit_trail_actor ON public.system_audit_trail(actor_id);
CREATE INDEX idx_audit_trail_created ON public.system_audit_trail(created_at);

CREATE TABLE IF NOT EXISTS public.system_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    job_type VARCHAR(50),
    payload JSONB,
    status VARCHAR(20) DEFAULT 'queued',
    priority INT DEFAULT 0,
    attempts INT DEFAULT 0,
    max_attempts INT DEFAULT 3,
    scheduled_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.system_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES public.profiles(id),
    status VARCHAR(20) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.system_cron_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    cron_expression VARCHAR(100) NOT NULL,
    handler VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_run_at TIMESTAMPTZ,
    next_run_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.system_maintenance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255),
    description TEXT,
    maintenance_type VARCHAR(50),
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MODULE 13: MINI-APP ECOSYSTEM (Website Mini-Apps)
CREATE TABLE IF NOT EXISTS public.mini_app_websites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    domain_name VARCHAR(255) NOT NULL,
    base_url TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_mini_app_websites_domain ON public.mini_app_websites(domain_name);

CREATE TABLE IF NOT EXISTS public.mini_app_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain VARCHAR(255) UNIQUE NOT NULL,
    owner_id UUID REFERENCES public.profiles(id),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mini_app_allowed_urls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    url_pattern TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mini_app_blocked_urls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url_pattern TEXT NOT NULL,
    reason TEXT,
    blocked_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mini_app_security_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    policy_type VARCHAR(50),
    policy_value TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mini_app_webview_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    javascript_enabled BOOLEAN DEFAULT TRUE,
    allow_popups BOOLEAN DEFAULT FALSE,
    allow_downloads BOOLEAN DEFAULT FALSE,
    user_agent_override TEXT,
    custom_css TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_mini_app_shortcuts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    icon_url TEXT,
    position INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_mini_app_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, miniapp_id)
);

CREATE TABLE IF NOT EXISTS public.user_mini_app_recent (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    miniapp_id UUID REFERENCES public.miniapps(id),
    url TEXT,
    app_name VARCHAR(255),
    accessed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_mini_app_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    miniapp_id UUID REFERENCES public.miniapps(id),
    action VARCHAR(50),
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_web_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    app_name VARCHAR(255),
    visited_at TIMESTAMPTZ DEFAULT NOW(),
    duration_seconds INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_user_web_visits_user ON public.user_web_visits(user_id);

CREATE TABLE IF NOT EXISTS public.user_web_visit_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    domain VARCHAR(255),
    visit_count INT DEFAULT 0,
    total_duration_seconds INT DEFAULT 0,
    last_visited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, domain)
);

CREATE TABLE IF NOT EXISTS public.user_frequent_sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    domain VARCHAR(255),
    url TEXT,
    title VARCHAR(255),
    favicon_url TEXT,
    visit_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_site_shortcuts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title VARCHAR(255),
    icon_url TEXT,
    position INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mini_app_dashboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    layout JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mini_app_dashboard_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dashboard_id UUID REFERENCES public.mini_app_dashboard(id) ON DELETE CASCADE,
    item_type VARCHAR(50),
    miniapp_id UUID REFERENCES public.miniapps(id),
    url TEXT,
    position INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mini_app_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    score FLOAT DEFAULT 0,
    reason VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mini_app_trending (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    trend_score FLOAT DEFAULT 0,
    daily_installs INT DEFAULT 0,
    daily_opens INT DEFAULT 0,
    trending_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mini_app_runtime_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.miniapp_sessions(id),
    level VARCHAR(20),
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mini_app_runtime_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.miniapp_sessions(id),
    error_type VARCHAR(100),
    message TEXT,
    stack TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mini_app_runtime_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.miniapp_sessions(id),
    permission VARCHAR(100),
    granted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mini_app_runtime_storage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    key VARCHAR(255),
    value TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mini_app_runtime_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    cache_key VARCHAR(255),
    cache_data JSONB,
    ttl INT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mini_app_page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    page_url TEXT,
    referrer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mini_app_click_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    element_id VARCHAR(255),
    element_type VARCHAR(50),
    page_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mini_app_performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    metric_name VARCHAR(100),
    metric_value FLOAT,
    unit VARCHAR(20),
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mini_app_install_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    stat_date DATE DEFAULT CURRENT_DATE,
    installs INT DEFAULT 0,
    uninstalls INT DEFAULT 0,
    active_users INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mini_app_daily_active_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    stat_date DATE DEFAULT CURRENT_DATE,
    dau INT DEFAULT 0,
    new_users INT DEFAULT 0,
    returning_users INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mini_app_security_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_name VARCHAR(255),
    rule_type VARCHAR(50),
    condition JSONB,
    action VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mini_app_domain_whitelist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain VARCHAR(255) NOT NULL,
    added_by UUID REFERENCES public.profiles(id),
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mini_app_domain_blacklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain VARCHAR(255) NOT NULL,
    added_by UUID REFERENCES public.profiles(id),
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mini_app_permission_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    miniapp_id UUID REFERENCES public.miniapps(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    permission VARCHAR(100),
    action VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MODULE 14: INSTAGRAM / FEED IMAGES
CREATE TABLE IF NOT EXISTS public.feed_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_feed_images_user ON public.feed_images(user_id);
CREATE INDEX idx_feed_images_created ON public.feed_images(created_at);

CREATE TABLE IF NOT EXISTS public.feed_image_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_id UUID REFERENCES public.feed_images(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(image_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.feed_image_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_id UUID REFERENCES public.feed_images(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MODULE 15: E-COMMERCE / STORE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    category VARCHAR(100),
    stock INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_products_user ON public.products(user_id);
CREATE INDEX idx_products_category ON public.products(category);

CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    position INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    parent_id UUID REFERENCES public.product_categories(id),
    icon VARCHAR(50),
    position INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.shopping_cart (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.shopping_cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID REFERENCES public.shopping_cart(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cart_id, product_id)
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',
    total DECIMAL(10,2) NOT NULL,
    shipping_name VARCHAR(255),
    shipping_address TEXT,
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_zip VARCHAR(20),
    shipping_phone VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    product_name VARCHAR(255),
    price DECIMAL(10,2),
    quantity INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.store_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, user_id)
);

-- MODULE 16: REDDIT / COMMUNITIES
CREATE TABLE IF NOT EXISTS public.communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    creator_id UUID REFERENCES public.profiles(id),
    member_count INT DEFAULT 1,
    post_count INT DEFAULT 0,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.community_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(community_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    body TEXT,
    image_url TEXT,
    vote_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_community_posts_community ON public.community_posts(community_id);

CREATE TABLE IF NOT EXISTS public.community_post_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    vote_type INT NOT NULL CHECK (vote_type IN (1, -1)),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.community_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.community_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    vote_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.community_comment_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID REFERENCES public.community_comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    vote_type INT NOT NULL CHECK (vote_type IN (1, -1)),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(comment_id, user_id)
);

-- MODULE 17: NOTION / NOTES
CREATE TABLE IF NOT EXISTS public.note_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(500) DEFAULT 'Untitled',
    content TEXT DEFAULT '',
    is_public BOOLEAN DEFAULT FALSE,
    icon VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_note_pages_user ON public.note_pages(user_id);

CREATE TABLE IF NOT EXISTS public.note_page_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES public.note_pages(id) ON DELETE CASCADE,
    title VARCHAR(500),
    content TEXT,
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.note_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES public.note_pages(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_type VARCHAR(100),
    file_size BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MODULE 18: CRM
CREATE TABLE IF NOT EXISTS public.crm_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    company_id UUID,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_crm_contacts_user ON public.crm_contacts(user_id);

CREATE TABLE IF NOT EXISTS public.crm_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    website VARCHAR(255),
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.crm_contacts ADD CONSTRAINT fk_crm_contacts_company
    FOREIGN KEY (company_id) REFERENCES public.crm_companies(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.crm_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(20) DEFAULT '#6366f1',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.crm_contact_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.crm_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(contact_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.crm_deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    company_id UUID REFERENCES public.crm_companies(id) ON DELETE SET NULL,
    contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
    value DECIMAL(15,2) DEFAULT 0,
    stage VARCHAR(50) DEFAULT 'lead',
    follow_up_date DATE,
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.crm_deal_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID REFERENCES public.crm_deals(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.crm_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID REFERENCES public.crm_deals(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    title VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.crm_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID REFERENCES public.crm_deals(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.crm_deal_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID REFERENCES public.crm_deals(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_type VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MODULE 19: AI CHATBOT
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) DEFAULT 'New Chat',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ai_conversations_user ON public.ai_conversations(user_id);

CREATE TABLE IF NOT EXISTS public.ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ai_messages_conversation ON public.ai_messages(conversation_id);
CREATE INDEX idx_ai_messages_created ON public.ai_messages(created_at);

-- ============================================================
-- SCHEMA SUMMARY: Total tables created in this file
-- Module 1 (User Identity): 15 tables
-- Module 2 (Contacts): 12 tables
-- Module 3 (Messaging): 18 tables
-- Module 4 (Groups): 20 tables
-- Module 5 (Social Feed): 21 tables
-- Module 6 (Discover): 10 tables
-- Module 7 (Mini-App Platform): 20 tables
-- Module 8 (Wallet/Payments): 21 tables
-- Module 9 (Notifications): 10 tables
-- Module 10 (Media Storage): 9 tables
-- Module 11 (Analytics): 10 tables
-- Module 12 (System Config): 12 tables
-- Module 13 (Mini-App Ecosystem): 30 tables
-- Module 14 (Instagram Feed): 3 tables
-- Module 15 (E-Commerce): 7 tables
-- Module 16 (Communities): 5 tables
-- Module 17 (Notes): 3 tables
-- Module 18 (CRM): 9 tables
-- Module 19 (AI Chatbot): 2 tables
-- Core schema (01_core_schema.sql): 12 tables
-- ============================================================
-- GRAND TOTAL: 249 tables in this file + 12 core = 261 tables
-- Plus role_permissions, story_highlight_items, contact_group_members
-- TOTAL: ~264 tables
-- ============================================================
