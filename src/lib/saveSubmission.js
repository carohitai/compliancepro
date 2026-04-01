import {
  saveClientSubmission, uploadFile, saveFileRecord,
  assessFileWithClaude, updateFileAssessment,
} from "./supabase";

// ─── Save Client Portal submission ────────────────────────────────────────────
export async function savePortalSubmission({ clientInfo, reportType, purpose, loanType, consent, files = [] }) {
  const { id, error } = await saveClientSubmission({
    portal_type:   "client",
    report_type:   reportType,
    name:          clientInfo.name,
    email:         clientInfo.email,
    mobile:        clientInfo.mobile,
    bac_code:      clientInfo.sector?.value,
    bac_label:     clientInfo.sector?.label,
    sector_group:  clientInfo.sector?.group,
    nature_of_business: clientInfo.nature?.value,
    nature_label:  clientInfo.nature?.label,
    purpose:       purpose?.value,
    loan_type:     loanType?.value,
    consent_given: consent?.given || false,
    consent_at:    consent?.timestamp,
    consent_version: consent?.version,
  });

  if (error || !id) return { id: null };

  // Upload + assess each file
  for (const file of files) {
    const { path, error: uploadErr } = await uploadFile(id, file);
    if (uploadErr || !path) continue;

    const { id: fileId } = await saveFileRecord({
      submission_id: id,
      file_name:     file.name,
      file_type:     file.name.split(".").pop().toLowerCase(),
      file_size:     file.size,
      storage_path:  path,
    });

    if (fileId) {
      // Fire-and-forget AI assessment
      const context = { name: clientInfo.name, sector: clientInfo.sector?.label, nature: clientInfo.nature?.label };
      assessFileWithClaude(path, file.name.split(".").pop(), context).then(({ assessment, error: aErr }) => {
        if (assessment?.assessment) updateFileAssessment(fileId, assessment.assessment);
        else if (aErr) updateFileAssessment(fileId, null);
      });
    }
  }

  return { id };
}

// ─── Save Professional Tool submission ────────────────────────────────────────
export async function saveProfessionalSubmission({ clientInfo, selectedAssignments, consent }) {
  const { id } = await saveClientSubmission({
    portal_type:           "professional",
    name:                  clientInfo.name,
    trade_name:            clientInfo.tradeName,
    constitution:          clientInfo.constitution,
    address:               clientInfo.address,
    email:                 clientInfo.email,
    mobile:                clientInfo.phone,
    financial_year:        clientInfo.financialYear,
    registrations:         clientInfo.registrations || {},
    selected_assignments:  selectedAssignments,
    consent_given:         consent?.given || false,
    consent_at:            consent?.timestamp,
  });
  return { id };
}
