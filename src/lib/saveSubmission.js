import { saveToAirtable } from "./airtable";

// ─── Save Client Portal submission ────────────────────────────────────────────
export async function savePortalSubmission({ clientInfo, reportType, purpose, loanType, consent, files = [] }) {
  const fileNames = files.map((f) => f.name).join(", ") || "None";

  return saveToAirtable({
    "Portal Type":          "Client Portal",
    "Report Type":          reportType || "",
    "Name":                 clientInfo.name || "",
    "Email":                clientInfo.email || "",
    "Mobile":               clientInfo.mobile || "",
    "BAC Code":             clientInfo.sector?.value || "",
    "BAC Sector":           clientInfo.sector?.label || "",
    "Sector Group":         clientInfo.sector?.group || "",
    "Nature of Business":   clientInfo.nature?.label || "",
    "Purpose":              purpose?.label || "",
    "Loan Type":            loanType?.label || "",
    "Uploaded Files":       fileNames,
    "Consent Given":        consent?.given ? true : false,
    "Consent At":           consent?.timestamp || "",
    "Submitted At":         new Date().toISOString(),
  });
}

// ─── Save Professional Tool submission ────────────────────────────────────────
export async function saveProfessionalSubmission({ clientInfo, selectedAssignments, consent }) {
  const regList = Object.entries(clientInfo.registrations || {})
    .filter(([, v]) => v?.enabled)
    .map(([k, v]) => `${k.toUpperCase()}: ${v.number || "—"}`)
    .join(" | ");

  return saveToAirtable({
    "Portal Type":          "Professional Tool",
    "Report Type":          "Requirement Report",
    "Name":                 clientInfo.name || "",
    "Email":                clientInfo.email || "",
    "Mobile":               clientInfo.phone || "",
    "Constitution":         clientInfo.constitution || "",
    "Trade Name":           clientInfo.tradeName || "",
    "Address":              clientInfo.address || "",
    "Financial Year":       clientInfo.financialYear || "",
    "Registrations":        regList,
    "Selected Assignments": (selectedAssignments || []).join(", "),
    "Consent Given":        consent?.given ? true : false,
    "Consent At":           consent?.timestamp || "",
    "Submitted At":         new Date().toISOString(),
  });
}
