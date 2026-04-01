// Supabase Edge Function: assess-file
// Reads an uploaded file from storage, sends to Claude for extraction,
// returns structured financial data.
// Deploy: supabase functions deploy assess-file

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Anthropic from "https://esm.sh/@anthropic-ai/sdk@0.27.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { filePath, fileType, submissionContext } = await req.json();

    // Init Supabase admin client (uses service role key from env)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("client-files")
      .download(filePath);

    if (downloadError || !fileData) {
      throw new Error(`File download failed: ${downloadError?.message}`);
    }

    // Convert to base64
    const arrayBuffer = await fileData.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    // Build Claude prompt
    const contextStr = submissionContext
      ? `Client: ${submissionContext.name}, Sector: ${submissionContext.sector}, Nature: ${submissionContext.nature}`
      : "Unknown client";

    const anthropic = new Anthropic({
      apiKey: Deno.env.get("ANTHROPIC_API_KEY")!,
    });

    // Determine media type
    const mediaTypeMap: Record<string, string> = {
      pdf:  "application/pdf",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      xls:  "application/vnd.ms-excel",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      doc:  "application/msword",
    };
    const ext = filePath.split(".").pop()?.toLowerCase() || "pdf";
    const mediaType = mediaTypeMap[ext] || "application/pdf";

    const messageContent: Anthropic.MessageParam["content"] = [];

    // For PDF: use document block; for others: text prompt only
    if (ext === "pdf") {
      messageContent.push({
        type: "document",
        source: { type: "base64", media_type: "application/pdf", data: base64 },
      } as any);
    }

    messageContent.push({
      type: "text",
      text: `You are a financial data extraction assistant for an Indian CA firm (Kolte & Associates LLP).

Context: ${contextStr}
File type: ${fileType || ext.toUpperCase()}

Extract ALL of the following from this document (leave empty array [] if not found):
1. Bank Accounts (bank name, account number/last 4, account type, balance if shown)
2. Loan Accounts (lender name, loan type, outstanding amount, EMI if shown)
3. Properties (description, location, value, ownership)
4. Business Income / Turnover figures (year, amount)
5. Tax details (PAN, TAN, GST number, TDS deducted/paid, advance tax)
6. Directors / Partners / Proprietor names
7. Key financial ratios or observations
8. Any compliance issues or notable items found

Return ONLY valid JSON in this exact structure:
{
  "bank_accounts": [{"bank": "", "account_last4": "", "type": "", "balance": ""}],
  "loan_accounts": [{"lender": "", "loan_type": "", "outstanding": "", "emi": ""}],
  "properties": [{"description": "", "location": "", "value": "", "ownership": ""}],
  "turnover": [{"year": "", "amount": "", "type": ""}],
  "tax_details": {"pan": "", "tan": "", "gst": "", "tds_paid": "", "advance_tax": ""},
  "promoters": [""],
  "key_observations": [""],
  "compliance_flags": [""],
  "document_type": "",
  "period_covered": "",
  "summary": ""
}`,
    });

    const response = await anthropic.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 2000,
      messages: [{ role: "user", content: messageContent }],
    });

    const rawText = response.content[0].type === "text" ? response.content[0].text : "";

    // Parse JSON from response
    let assessment: Record<string, unknown> = {};
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) assessment = JSON.parse(jsonMatch[0]);
    } catch {
      assessment = { summary: rawText, parse_error: true };
    }

    return new Response(JSON.stringify({ success: true, assessment }), {
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
