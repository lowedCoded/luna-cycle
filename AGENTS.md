<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Deployment
- **Hosting**: Cloudflare Pages (static export)
- **URL**: https://luna-cycle-487.pages.dev
- **GitHub**: https://github.com/lowedCoded/luna-cycle
- **Build**: `npm run build` → `out/` directory
- **Deploy**: `npx wrangler pages deploy out --project-name luna-cycle --branch main`
- **Env vars** (set in Cloudflare): NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

## Backend
- **Supabase**: https://sqlvibrwskbgjxzrmkft.supabase.co
- **Auth**: Email/password, email confirmations DISABLED
- **DB**: PostgreSQL with tables: user_profiles, user_cycles, user_entries, user_habits, user_medications, user_settings (JSONB)
- **Client**: `src/lib/supabase/client.ts` — safe init, returns null if env missing

## Important
- Static export: `output: 'export'` in next.config.ts
- No middleware, no API routes (static export incompatible)
- Supabase client talks directly to Supabase (no server proxy)
- Build needs `.env.local` locally; Cloudflare has env vars
