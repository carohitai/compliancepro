# CompliancePro — Claude Code Project Memory

## Overview
Tax and compliance reporting SPA for **Kolte & Associates LLP** (Indian CA firm). Multi-portal architecture for generating compliance reports, tax checklists, impact analysis, and debt sourcing assessments.

## Tech Stack
- **Frontend:** React 19 + Vite 8 + Tailwind CSS 3.4 (JSX, not TypeScript)
- **State:** React hooks only (useState/useEffect) — no Redux/Zustand
- **Styling:** Tailwind utility classes only — no CSS modules or styled-components
- **Backend:** Supabase edge functions (Deno + TypeScript)
- **Database:** Airtable REST API (primary), Supabase PostgreSQL (secondary)
- **AI:** Anthropic Claude API via Supabase edge function (`assess-file`)
- **PDF:** jsPDF + html2canvas (client-side generation)
- **Messaging:** WhatsApp via Nextel API (proxied through Supabase edge function)
- **Deployment:** GitHub Actions → GitHub Pages (base path: `/compliancepro/`)

## Key Commands
```bash
npm run dev       # Vite dev server with HMR
npm run build     # Production build → dist/
npm run lint      # ESLint check
npm run preview   # Preview production build
```

## Project Structure
```
src/
├── components/
│   ├── portal/          # Client portal forms
│   ├── compliance/      # Compliance & comparison reports
│   ├── requirement/     # Requirement report generator
│   ├── whatchanges/     # "What Changes For Me" portal
│   ├── dashboard/       # Staff admin dashboard
│   ├── HomeScreen.jsx   # 4-portal landing page
│   └── ClientInfoForm.jsx
├── lib/
│   ├── airtable.js      # Airtable CRUD (Bearer token, typecast)
│   ├── supabase.js      # Supabase client + storage + edge functions
│   ├── saveSubmission.js
│   ├── uploadPdf.js
│   ├── generateWhatChangesPdf.js
│   └── generateShareableUrl.js
├── data/                # Static compliance/tax data
│   ├── requirements.js
│   ├── complianceData.js
│   ├── newTaxAct.js
│   ├── bankRates.js
│   └── bacCodes.js
├── App.jsx              # Router & main app (hash-based routing)
└── main.jsx             # Entry point
supabase/functions/
├── assess-file/index.ts   # Claude AI file extraction
└── send-whatsapp/index.ts # WhatsApp proxy
```

## Coding Conventions
- **Components:** Functional, PascalCase filenames (e.g., `ClientInfoForm.jsx`)
- **Exports:** Named exports preferred; default export for main component per file
- **API pattern:** All API functions return `{ data/id, error }` — always handle both
- **Graceful degradation:** Check `isAirtableEnabled` / `isSupabaseEnabled` before API calls
- **No TypeScript in frontend** — only in Supabase edge functions (Deno runtime)
- **Imports:** Use `import.meta.env.VITE_*` for environment variables

## Environment Variables
```
VITE_AIRTABLE_TOKEN      # Airtable personal access token
VITE_AIRTABLE_BASE_ID    # Airtable base ID (appXXXX)
VITE_DASHBOARD_PASSWORD   # Staff dashboard password
VITE_SUPABASE_URL         # Supabase project URL (optional)
VITE_SUPABASE_ANON_KEY    # Supabase anonymous key (optional)
```

## App Portals (hash routes)
- `#/` — Home (portal selector)
- `#/professional` — Professional compliance tool
- `#/compliance-report` — Compliance analysis
- `#/requirements-checklist` — Tax requirements
- `#/debt-sourcing` — Loan documentation
- `?wcm=1` — "What Changes For Me" (shareable URLs)
- `#/dashboard` — Staff admin (password protected)

## CI/CD
- GitHub Actions deploys on push to `main`
- Build uses Node 20, secrets injected as env vars
- Deploys to GitHub Pages at `/compliancepro/` base path

## Important Notes
- No test suite exists yet — Vitest recommended if adding tests
- Airtable is primary DB; Supabase is secondary for storage/functions
- PDF generation uses DOM-to-canvas approach (render hidden template → capture)
- Edge functions use `Deno.serve()` with CORS headers and OPTIONS preflight
