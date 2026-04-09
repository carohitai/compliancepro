---
name: supabase-edge
description: Create Supabase Edge Functions following CompliancePro's Deno/TypeScript patterns. Use when the user wants to create a new serverless function, API endpoint, or backend handler.
---

# Supabase Edge Function Creator

Create Supabase Edge Functions following the exact patterns from the CompliancePro codebase.

## Template

Every edge function follows this structure (from `supabase/functions/assess-file/index.ts`):

```typescript
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  // Always handle OPTIONS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // Init Supabase admin client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Function logic here...

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

## Key Patterns

1. **Runtime:** Deno with TypeScript — use `https://esm.sh/` for imports
2. **CORS:** Always include `corsHeaders` and handle `OPTIONS` preflight
3. **Supabase client:** Use service role key from `Deno.env.get()` for admin access
4. **Error handling:** Try/catch wrapping entire handler, return structured JSON errors
5. **Response format:** Always `{ success: boolean, data/error: ... }`

## Placement

All edge functions go in: `supabase/functions/<function-name>/index.ts`

## Calling from Frontend

Add a wrapper in `src/lib/supabase.js`:

```javascript
export async function callNewFunction(params) {
  if (!supabase) return { data: null, error: null }; // graceful no-op
  const { data, error } = await supabase.functions.invoke("function-name", {
    body: params,
  });
  return { data, error };
}
```

## Available Environment Variables (Deno runtime)

- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Admin access key
- `SUPABASE_ANON_KEY` — Public anonymous key
- `ANTHROPIC_API_KEY` — For Claude API calls (if needed)

## Workflow

1. Create the function directory and `index.ts`
2. Add a frontend wrapper in `src/lib/supabase.js`
3. If using Claude API, follow the pattern from `assess-file/index.ts`
4. Deploy with: `supabase functions deploy <function-name>`

## Existing Functions (reference)

- `assess-file` — Reads uploaded files from storage, sends to Claude for financial data extraction
- `send-whatsapp` — Proxies WhatsApp template messages via Nextel API
