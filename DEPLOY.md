# WITS Super-App: Deploy & Build

## Same backend for Web and APK

Web and Android APK both use **the same InsForge backend**. The app is built once from `frontend-react` with `VITE_INSFORGE_*` env vars inlined at build time. That same build is served on the web and packaged into the APK.

- **Web**: Deploy the `frontend-react/dist` output to InsForge hosting or any static host.
- **APK**: `npx cap sync android` copies `frontend-react/dist` into the Android app; the APK uses the same API URL and anon key as the web build.

## 1. Database (InsForge PostgreSQL)

Run this SQL in your InsForge project (SQL editor or migration) so settings sync works:

```sql
-- File: db/wits_user_settings.sql
CREATE TABLE IF NOT EXISTS public.wits_user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

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
```

## 2. Environment

In `frontend-react/`:

- Copy `.env.example` to `.env`.
- Set `VITE_INSFORGE_BASE_URL` and `VITE_INSFORGE_ANON_KEY` to your InsForge project URL and anon key.

## 3. Build Web

```bash
cd frontend-react
npm install
npm run build
```

Output: `frontend-react/dist/`

## 4. Deploy Web to InsForge

- Use InsForge **Hosting** (or MCP `create-deployment`): upload or point to the `dist` folder.
- Or deploy `dist` to any static host (Vercel, Netlify, etc.) with SPA fallback to `index.html`.

## 5. Run Locally

```bash
cd frontend-react
npm run dev
```

Open the URL shown (e.g. http://localhost:5173).

## 6. Build Android APK

From repo root:

```bash
cd frontend-react && npm run build
cd ..
npx cap sync android
cd android && .\gradlew.bat assembleDebug
```

APK output: `android/app/build/outputs/apk/debug/app-debug.apk`

For a release APK, configure signing in `android/app/build.gradle` and run `assembleRelease`.

## 7. Java version (Android)

The Android build uses **Java 17**. If you use `npx cap update` and it regenerates `android/app/capacitor.build.gradle` with Java 21, change it back to `VERSION_17` if your JDK is 17, or install JDK 21.

## Checklist

- [ ] Run `wits_user_settings` SQL on InsForge DB
- [ ] Set `frontend-react/.env` with InsForge URL and anon key
- [ ] `npm run build` in frontend-react
- [ ] Deploy `frontend-react/dist` to InsForge or static host
- [ ] `npx cap sync android` then `gradlew assembleDebug` for APK
