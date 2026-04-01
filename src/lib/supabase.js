import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  || "";
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const isSupabaseEnabled = Boolean(supabaseUrl && supabaseKey);

// ─── Save client submission ───────────────────────────────────────────────────
export async function saveClientSubmission(data) {
  if (!supabase) return { id: null, error: null }; // graceful no-op
  const { data: row, error } = await supabase
    .from("client_submissions")
    .insert([data])
    .select("id")
    .single();
  return { id: row?.id || null, error };
}

// ─── Upload file to Supabase Storage ─────────────────────────────────────────
export async function uploadFile(submissionId, file) {
  if (!supabase) return { path: null, error: null };
  const ext  = file.name.split(".").pop();
  const path = `${submissionId}/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from("client-files")
    .upload(path, file, { contentType: file.type, upsert: false });
  return { path: data?.path || null, error };
}

// ─── Save file record + trigger AI assessment ─────────────────────────────────
export async function saveFileRecord(record) {
  if (!supabase) return { id: null, error: null };
  const { data, error } = await supabase
    .from("client_files")
    .insert([record])
    .select("id")
    .single();
  return { id: data?.id || null, error };
}

// ─── Call Edge Function to assess file with Claude ───────────────────────────
export async function assessFileWithClaude(filePath, fileType, submissionContext) {
  if (!supabase) return { assessment: null, error: null };
  const { data, error } = await supabase.functions.invoke("assess-file", {
    body: { filePath, fileType, submissionContext },
  });
  return { assessment: data, error };
}

// ─── Update file with AI assessment ──────────────────────────────────────────
export async function updateFileAssessment(fileId, assessment) {
  if (!supabase) return { error: null };
  const { error } = await supabase
    .from("client_files")
    .update({ ai_assessment: assessment, assessed_at: new Date().toISOString() })
    .eq("id", fileId);
  return { error };
}

// ─── Dashboard: fetch all submissions ─────────────────────────────────────────
export async function fetchSubmissions({ limit = 50, offset = 0 } = {}) {
  if (!supabase) return { data: [], error: null };
  const { data, error } = await supabase
    .from("client_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  return { data: data || [], error };
}

// ─── Dashboard: fetch single submission with files ────────────────────────────
export async function fetchSubmissionDetail(id) {
  if (!supabase) return { submission: null, files: [], error: null };
  const [{ data: submission }, { data: files }] = await Promise.all([
    supabase.from("client_submissions").select("*").eq("id", id).single(),
    supabase.from("client_files").select("*").eq("submission_id", id).order("created_at"),
  ]);
  return { submission, files: files || [], error: null };
}

// ─── Get signed URL for file download ────────────────────────────────────────
export async function getFileUrl(path) {
  if (!supabase) return null;
  const { data } = await supabase.storage
    .from("client-files")
    .createSignedUrl(path, 3600);
  return data?.signedUrl || null;
}
