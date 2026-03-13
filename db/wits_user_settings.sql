-- WITS Super-App: User settings cloud sync table for InsForge PostgreSQL
-- Stores full WitsSettings JSON per user for cross-device sync.

CREATE TABLE IF NOT EXISTS public.wits_user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by user_id (unique already creates index; optional comment)
COMMENT ON TABLE public.wits_user_settings IS 'WITS Super-App centralized user settings (notifications, privacy, UI, etc.)';

-- RLS: allow users to read/write only their own row (if using auth.uid())
-- InsForge may map auth to user_id; adjust policy to match your auth schema.
-- Example (uncomment and adjust if your InsForge project uses RLS):
-- ALTER TABLE public.wits_user_settings ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can manage own settings"
--     ON public.wits_user_settings
--     FOR ALL
--     USING (auth.uid() = user_id)
--     WITH CHECK (auth.uid() = user_id);

-- Optional: trigger to keep updated_at in sync
CREATE OR REPLACE FUNCTION public.wits_user_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS wits_user_settings_updated_at ON public.wits_user_settings;
CREATE TRIGGER wits_user_settings_updated_at
    BEFORE UPDATE ON public.wits_user_settings
    FOR EACH ROW
    EXECUTE PROCEDURE public.wits_user_settings_updated_at();
