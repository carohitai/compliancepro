/**
 * Phase 2 WhatsApp — PDF upload to temporary public hosting.
 *
 * Both services are called through corsproxy.io to bypass browser CORS
 * restrictions (tmpfiles.org and file.io don't send CORS headers for
 * cross-origin browser requests).
 *
 * Order:
 *   1. tmpfiles.org  — multi-download, auto-deletes in 1 hour
 *   2. file.io       — single-use download, 14-day expiry
 *
 * Returns a direct-download URL on success, or null on failure.
 */

const CORS_PROXY = "https://corsproxy.io/?";

export async function uploadPdfBlob(blob, filename) {
  // ── Attempt 1: tmpfiles.org via CORS proxy ────────────────────────────────
  try {
    const form = new FormData();
    form.append("file", blob, filename);

    const res = await fetch(
      CORS_PROXY + encodeURIComponent("https://tmpfiles.org/api/v1/upload"),
      { method: "POST", body: form }
    );

    if (res.ok) {
      const data = await res.json();
      const pageUrl = data?.data?.url;
      if (pageUrl) {
        // Convert web-page URL → direct-download URL
        return pageUrl.replace("https://tmpfiles.org/", "https://tmpfiles.org/dl/");
      }
    }
  } catch {
    // CORS proxy or tmpfiles failed — try next
  }

  // ── Attempt 2: file.io via CORS proxy ─────────────────────────────────────
  try {
    const form = new FormData();
    form.append("file", blob, filename);

    const res = await fetch(
      CORS_PROXY + encodeURIComponent("https://file.io/?expires=1d"),
      { method: "POST", body: form }
    );

    if (res.ok) {
      const data = await res.json();
      if (data?.success && data?.link) return data.link;
    }
  } catch {
    // Both failed
  }

  return null;
}
