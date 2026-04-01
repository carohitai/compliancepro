import { saveToAirtable } from "./airtable";

// ─── Save Client Portal submission ────────────────────────────────────────────
// Fields must match columns in the "Client Submissions" Airtable table exactly.
export async function savePortalSubmission({ clientInfo, reportType, purpose, loanType, consent, files = [] }) {
  const fileNames = files.map((f) => f.name).join(", ") || "None";

  const result = await saveToAirtable({
    "Portal Type":          "Client Portal",
    "Report Type":          reportType || "",
    "Name":                 clientInfo?.name || "",
    "Email":                clientInfo?.email || "",
    "Mobile":               clientInfo?.mobile || "",
    "BAC Sector":           clientInfo?.sector?.label
                              ? `${clientInfo.sector.label} (${clientInfo.sector.value || ""})`
                              : "",
    "Sector Group":         clientInfo?.sector?.group || "",
    "Nature of Business":   clientInfo?.nature?.label || "",
    "Purpose":              purpose?.label || "",
    "Loan Type":            loanType?.label || "",
    "Uploaded Files":       fileNames,
    "Consent Given":        consent?.given ? "Yes" : "No",
    "Consent At":           consent?.timestamp || "",
    "Submitted At":         new Date().toISOString(),
  });

  if (result.error) {
    console.error("[savePortalSubmission] Airtable error:", result.error);
  }
  return result;
}

// ─── Save Professional Tool submission ────────────────────────────────────────
export async function saveProfessionalSubmission({ clientInfo, selectedAssignments, consent }) {
  const regList = Object.entries(clientInfo?.registrations || {})
    .filter(([, v]) => v?.enabled)
    .map(([k, v]) => `${k.toUpperCase()}: ${v.number || "—"}`)
    .join(" | ");

  const result = await saveToAirtable({
    "Portal Type":          "Professional Tool",
    "Report Type":          "Requirement Report",
    "Name":                 clientInfo?.name || "",
    "Email":                clientInfo?.email || "",
    "Mobile":               clientInfo?.phone || "",
    "Constitution":         clientInfo?.constitution || "",
    "Financial Year":       clientInfo?.financialYear || "",
    "Registrations":        regList,
    "Selected Assignments": (selectedAssignments || []).join(", "),
    "Consent Given":        consent?.given ? "Yes" : "No",
    "Consent At":           consent?.timestamp || "",
    "Submitted At":         new Date().toISOString(),
  });

  if (result.error) {
    console.error("[saveProfessionalSubmission] Airtable error:", result.error);
  }
  return result;
}
