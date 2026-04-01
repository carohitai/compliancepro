// Airtable Integration
// Docs: https://airtable.com/developers/web/api/introduction
// Table: "Client Submissions" in your Airtable Base

const AIRTABLE_TOKEN   = import.meta.env.VITE_AIRTABLE_TOKEN   || "";
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID || "";
const TABLE_NAME       = "Client Submissions";

export const isAirtableEnabled = Boolean(AIRTABLE_TOKEN && AIRTABLE_BASE_ID);

const API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;

const headers = () => ({
  Authorization: `Bearer ${AIRTABLE_TOKEN}`,
  "Content-Type": "application/json",
});

// ─── Save any client submission ───────────────────────────────────────────────
export async function saveToAirtable(fields) {
  if (!isAirtableEnabled) {
    console.warn("[Airtable] Not configured — VITE_AIRTABLE_TOKEN or VITE_AIRTABLE_BASE_ID missing.");
    return { id: null, error: null };
  }
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: headers(),
      // typecast: true — Airtable coerces types (e.g. string → checkbox bool)
      body: JSON.stringify({ fields, typecast: true }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err?.error?.message || `HTTP ${res.status}`;
      console.error("[Airtable] Save failed:", msg, err);
      return { id: null, error: msg };
    }
    const data = await res.json();
    return { id: data.id, error: null };
  } catch (e) {
    console.error("[Airtable] Network error:", e.message);
    return { id: null, error: e.message };
  }
}

// ─── Fetch all submissions (for dashboard) ────────────────────────────────────
export async function fetchFromAirtable() {
  if (!isAirtableEnabled) return { records: [], error: null };
  try {
    const res = await fetch(
      `${API_URL}?sort[0][field]=Submitted At&sort[0][direction]=desc&maxRecords=200`,
      { headers: headers() }
    );
    if (!res.ok) return { records: [], error: "Fetch failed" };
    const data = await res.json();
    return { records: data.records || [], error: null };
  } catch (e) {
    return { records: [], error: e.message };
  }
}
