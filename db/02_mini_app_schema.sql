-- MINI-APP ECOSYSTEM SCHEMA FOR INSFORGE
-- Generated for Super-App Platform

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-------------------------------------------------------------------------------
-- CORE MINI APP REGISTRY
-------------------------------------------------------------------------------

CREATE TABLE mini_app_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mini_app_developers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- Reference to auth.users (handled via profiles usually)
    company_name TEXT,
    website TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mini_apps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    website_url TEXT NOT NULL,
    category_id UUID REFERENCES mini_app_categories(id),
    developer_id UUID REFERENCES mini_app_developers(id),
    is_verified BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mini_app_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mini_app_id UUID NOT NULL REFERENCES mini_apps(id) ON DELETE CASCADE,
    version_number TEXT NOT NULL,
    changelog TEXT,
    source_url TEXT, -- If hosted on platform
    is_stable BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mini_app_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mini_app_id UUID NOT NULL REFERENCES mini_apps(id) ON DELETE CASCADE,
    permission_name TEXT NOT NULL, -- e.g., 'camera', 'location', 'contacts'
    is_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mini_app_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mini_app_id UUID NOT NULL REFERENCES mini_apps(id) ON DELETE CASCADE UNIQUE,
    theme_color TEXT,
    orientation TEXT DEFAULT 'portrait', -- portrait, landscape
    auto_update BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-------------------------------------------------------------------------------
-- USER MINI APP SYSTEM
-------------------------------------------------------------------------------

CREATE TABLE user_mini_app_installs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    mini_app_id UUID NOT NULL REFERENCES mini_apps(id) ON DELETE CASCADE,
    installed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, mini_app_id)
);

CREATE TABLE user_mini_app_shortcuts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    mini_app_id UUID NOT NULL REFERENCES mini_apps(id) ON DELETE CASCADE,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, mini_app_id)
);

CREATE TABLE user_mini_app_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    mini_app_id UUID NOT NULL REFERENCES mini_apps(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, mini_app_id)
);

CREATE TABLE user_mini_app_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    mini_app_id UUID NOT NULL REFERENCES mini_apps(id) ON DELETE CASCADE,
    last_opened_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usage_duration_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-------------------------------------------------------------------------------
-- WEBSITE MINI APP SUPPORT
-------------------------------------------------------------------------------

CREATE TABLE mini_app_websites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mini_app_id UUID NOT NULL REFERENCES mini_apps(id) ON DELETE CASCADE UNIQUE,
    domain_name TEXT NOT NULL,
    base_url TEXT NOT NULL,
    security_policy JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mini_app_allowed_urls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_id UUID NOT NULL REFERENCES mini_app_websites(id) ON DELETE CASCADE,
    pattern TEXT NOT NULL, -- e.g., 'https://api.amazon.com/*'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-------------------------------------------------------------------------------
-- RUNTIME AND SESSION MANAGEMENT
-------------------------------------------------------------------------------

CREATE TABLE mini_app_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    mini_app_id UUID NOT NULL REFERENCES mini_apps(id) ON DELETE CASCADE,
    token TEXT UNIQUE,
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mini_app_runtime_errors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES mini_app_sessions(id) ON DELETE SET NULL,
    error_message TEXT,
    stack_trace TEXT,
    device_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-------------------------------------------------------------------------------
-- ANALYTICS
-------------------------------------------------------------------------------

CREATE TABLE mini_app_usage_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mini_app_id UUID NOT NULL REFERENCES mini_apps(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    event_type TEXT NOT NULL, -- 'open', 'click', 'page_view'
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-------------------------------------------------------------------------------
-- REVIEWS AND RATINGS
-------------------------------------------------------------------------------

CREATE TABLE mini_app_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    mini_app_id UUID NOT NULL REFERENCES mini_apps(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, mini_app_id)
);

-------------------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE
-------------------------------------------------------------------------------

-- Index for User IDs (Search apps by user faster)
CREATE INDEX idx_user_installs_user_id ON user_mini_app_installs(user_id);
CREATE INDEX idx_user_history_user_id ON user_mini_app_history(user_id);
CREATE INDEX idx_user_sessions_user_id ON mini_app_sessions(user_id);

-- Index for Mini App IDs (Search users by app faster)
CREATE INDEX idx_user_installs_app_id ON user_mini_app_installs(mini_app_id);
CREATE INDEX idx_user_favorites_app_id ON user_mini_app_favorites(mini_app_id);
CREATE INDEX idx_reviews_app_id ON mini_app_reviews(mini_app_id);

-- Index for Timestamps (Chronological sorts)
CREATE INDEX idx_history_created_at ON user_mini_app_history(created_at);
CREATE INDEX idx_metrics_created_at ON mini_app_usage_metrics(created_at);
CREATE INDEX idx_sessions_starts_at ON mini_app_sessions(starts_at);
