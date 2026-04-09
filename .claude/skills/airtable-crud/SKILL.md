---
name: airtable-crud
description: Generate Airtable API integration code following CompliancePro patterns. Use when the user wants to add new Airtable tables, fields, or CRUD operations.
---

# Airtable CRUD Generator

Generate Airtable REST API integration code following the patterns in `src/lib/airtable.js`.

## Core Patterns

### Configuration
```javascript
const AIRTABLE_TOKEN   = import.meta.env.VITE_AIRTABLE_TOKEN   || "";
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID || "";
const TABLE_NAME       = "Your Table Name";

export const isAirtableEnabled = Boolean(AIRTABLE_TOKEN && AIRTABLE_BASE_ID);

const API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;

const headers = () => ({
  Authorization: `Bearer ${AIRTABLE_TOKEN}`,
  "Content-Type": "application/json",
});
```

### Create Record
```javascript
export async function saveToTable(fields) {
  if (!isAirtableEnabled) {
    console.warn("[Airtable] Not configured");
    return { id: null, error: null };
  }
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ fields, typecast: true }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { id: null, error: err?.error?.message || `HTTP ${res.status}` };
    }
    const data = await res.json();
    return { id: data.id, error: null };
  } catch (e) {
    return { id: null, error: e.message };
  }
}
```

### Fetch Records
```javascript
export async function fetchFromTable() {
  if (!isAirtableEnabled) return { records: [], error: null };
  try {
    const res = await fetch(
      `${API_URL}?sort[0][field]=Created&sort[0][direction]=desc&maxRecords=200`,
      { headers: headers() }
    );
    if (!res.ok) return { records: [], error: "Fetch failed" };
    const data = await res.json();
    return { records: data.records || [], error: null };
  } catch (e) {
    return { records: [], error: e.message };
  }
}
```

## Key Rules

1. **Always check `isAirtableEnabled`** before API calls — graceful no-op when not configured
2. **Return `{ data/id, error }`** — always handle both in calling code
3. **Use `typecast: true`** in POST/PATCH — lets Airtable coerce types automatically
4. **URL-encode table names** — `encodeURIComponent(TABLE_NAME)` in the API URL
5. **Bearer token auth** — passed in Authorization header
6. **Error format:** `err?.error?.message` from Airtable error responses

## Existing Table: "Client Submissions"

Current fields: Name, Email, WhatsApp, BAC Code, Sector Group, Nature of Business, Constitution, Trade Name, Address, Financial Year, Assessment Year, Purpose, Registrations, Selected Assignments, Consent Given, Submitted At, Portal Type, Report Type

## Workflow

1. Define the new table name and fields
2. Create functions following the patterns above
3. Add to existing `src/lib/airtable.js` or create a new file in `src/lib/`
4. Use `isAirtableEnabled` guard in all API calls
5. Test with `npm run dev`
