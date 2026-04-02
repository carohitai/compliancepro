import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Nextel WhatsApp Business API — called server-side to avoid browser CORS restrictions
const NEXTEL_SEND_URL =
  "https://api.nextel.io/API_V2/Whatsapp/send_template/ZlVhbG5hS3J3SElqMnllNUJsUllGZz09";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, authorization",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();

    const nextelRes = await fetch(NEXTEL_SEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await nextelRes.json().catch(() => ({}));

    return new Response(JSON.stringify(data), {
      status: nextelRes.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
