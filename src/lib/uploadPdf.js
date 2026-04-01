/**
 * Phase 2 WhatsApp — PDF upload to temporary public hosting.
 *
 * Tries services in order:
 *   1. tmpfiles.org  — multi-download, auto-deletes in 1 hour, CORS-friendly
 *   2. file.io       — single-use download link, 14-day expiry
 *
 * Returns a direct-download URL string on success, or null if both fail.
 * Caller must fall back to Phase 1 (app URL) when null is returned.
 */
export async function uploadPdfBlob(blob, filename) {
  // ── Attempt 1: tmpfiles.org ───────────────────────────────────────────────
  try {
    const form = new FormData();
    form.append("file", blob, filename);

    const res = await fetch("https://tmpfiles.org/api/v1/upload", {
      method: "POST",
      body: form,
    });

    if (res.ok) {
      const data = await res.json();
      // Response: { status: "success", data: { url: "https://tmpfiles.org/123/file.pdf" } }
      const pageUrl = data?.data?.url;
      if (pageUrl) {
        // Convert web-page URL to direct-download URL
        // https://tmpfiles.org/123/file.pdf → https://tmpfiles.org/dl/123/file.pdf
        return pageUrl.replace("https://tmpfiles.org/", "https://tmpfiles.org/dl/");
      }
    }
  } catch {
    // Network error or CORS block — try next service
  }

  // ── Attempt 2: file.io ────────────────────────────────────────────────────
  try {
    const form = new FormData();
    form.append("file", blob, filename);

    const res = await fetch("https://file.io/?expires=14d", {
      method: "POST",
      body: form,
    });

    if (res.ok) {
      const data = await res.json();
      // Response: { success: true, link: "https://file.io/xxxxxxxx" }
      if (data?.success && data?.link) {
        return data.link;
      }
    }
  } catch {
    // Both services failed
  }

  return null; // Caller should fall back to Phase 1 app URL
}
