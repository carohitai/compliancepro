import { supabase } from "./supabase";

// ─── Helper: get or create daily report for a given date ─────────────────────
export async function getOrCreateReport(date) {
  if (!supabase) return { id: null, error: "Supabase not configured" };
  const dateStr = typeof date === "string" ? date : date.toISOString().split("T")[0];

  // Try to fetch existing
  let { data, error } = await supabase
    .from("daily_reports")
    .select("*")
    .eq("report_date", dateStr)
    .single();

  if (data) return { report: data, error: null };

  // Create new
  const { data: created, error: createErr } = await supabase
    .from("daily_reports")
    .insert([{ report_date: dateStr }])
    .select("*")
    .single();

  return { report: created, error: createErr };
}

// ─── Book Stock ──────────────────────────────────────────────────────────────
export async function fetchBookStock(reportId) {
  if (!supabase) return [];
  const { data } = await supabase
    .from("dr_book_stock")
    .select("*")
    .eq("report_id", reportId)
    .order("standard_class");
  return data || [];
}

export async function upsertBookStock(reportId, rows) {
  if (!supabase) return { error: "Supabase not configured" };
  const records = rows.map((r) => ({
    report_id: reportId,
    standard_class: r.standard_class,
    opening_stock: r.opening_stock || 0,
    purchased: r.purchased || 0,
    sold: r.sold || 0,
    entered_by: r.entered_by || "librarian",
  }));
  const { error } = await supabase
    .from("dr_book_stock")
    .upsert(records, { onConflict: "report_id,standard_class" });
  return { error };
}

// Fetch previous day's closing stock to use as today's opening stock
export async function fetchPreviousDayClosingStock(currentDate) {
  if (!supabase) return {};
  const dateStr = typeof currentDate === "string" ? currentDate : currentDate.toISOString().split("T")[0];
  const { data } = await supabase
    .from("daily_reports")
    .select("id, report_date")
    .lt("report_date", dateStr)
    .order("report_date", { ascending: false })
    .limit(1)
    .single();

  if (!data) return {};

  const { data: stock } = await supabase
    .from("dr_book_stock")
    .select("standard_class, closing_stock")
    .eq("report_id", data.id);

  const map = {};
  (stock || []).forEach((s) => { map[s.standard_class] = s.closing_stock; });
  return map;
}

// ─── Admissions ──────────────────────────────────────────────────────────────
export async function fetchAdmissions(reportId) {
  if (!supabase) return [];
  const { data } = await supabase
    .from("dr_admissions")
    .select("*")
    .eq("report_id", reportId)
    .order("standard_class");
  return data || [];
}

export async function upsertAdmissions(reportId, rows) {
  if (!supabase) return { error: "Supabase not configured" };
  const records = rows.map((r) => ({
    report_id: reportId,
    standard_class: r.standard_class,
    new_admissions: r.new_admissions || 0,
    finance_count: r.finance_count || 0,
    one_time_count: r.one_time_count || 0,
    amount_collected: r.amount_collected || 0,
    entered_by: r.entered_by || "admin",
  }));
  const { error } = await supabase
    .from("dr_admissions")
    .upsert(records, { onConflict: "report_id,standard_class" });
  return { error };
}

export async function fetchAdmissionsCumulative() {
  if (!supabase) return [];
  const { data } = await supabase.from("v_admissions_cumulative").select("*");
  return data || [];
}

// ─── Enquiries ───────────────────────────────────────────────────────────────
export async function fetchEnquiries(reportId) {
  if (!supabase) return [];
  const { data } = await supabase
    .from("dr_enquiries")
    .select("*")
    .eq("report_id", reportId)
    .order("created_at");
  return data || [];
}

export async function addEnquiry(reportId, enquiry) {
  if (!supabase) return { error: "Supabase not configured" };
  const { error } = await supabase.from("dr_enquiries").insert([{
    report_id: reportId,
    enquiry_for_class: enquiry.enquiry_for_class,
    parent_name: enquiry.parent_name || "",
    contact_number: enquiry.contact_number || "",
    converted: enquiry.converted || false,
    notes: enquiry.notes || "",
    entered_by: enquiry.entered_by || "admin",
  }]);
  return { error };
}

export async function updateEnquiry(id, updates) {
  if (!supabase) return { error: "Supabase not configured" };
  const { error } = await supabase.from("dr_enquiries").update(updates).eq("id", id);
  return { error };
}

export async function deleteEnquiry(id) {
  if (!supabase) return { error: "Supabase not configured" };
  const { error } = await supabase.from("dr_enquiries").delete().eq("id", id);
  return { error };
}

export async function fetchEnquirySummary() {
  if (!supabase) return { total: 0, converted: 0, notConverted: 0 };
  const { data } = await supabase.from("dr_enquiries").select("converted");
  if (!data) return { total: 0, converted: 0, notConverted: 0 };
  return {
    total: data.length,
    converted: data.filter((e) => e.converted).length,
    notConverted: data.filter((e) => !e.converted).length,
  };
}

export async function fetchEnquiryMonthly() {
  if (!supabase) return [];
  const { data } = await supabase.from("v_enquiry_monthly").select("*");
  return data || [];
}

// ─── Bus Forms ───────────────────────────────────────────────────────────────
export async function fetchBusForms(reportId) {
  if (!supabase) return [];
  const { data } = await supabase
    .from("dr_bus_forms")
    .select("*")
    .eq("report_id", reportId)
    .order("bus_number");
  return data || [];
}

export async function upsertBusForms(reportId, rows) {
  if (!supabase) return { error: "Supabase not configured" };
  const records = rows.map((r) => ({
    report_id: reportId,
    bus_number: r.bus_number,
    forms_filled: r.forms_filled || 0,
    bus_fees_collected: r.bus_fees_collected || 0,
    entered_by: r.entered_by || "admin",
  }));
  const { error } = await supabase
    .from("dr_bus_forms")
    .upsert(records, { onConflict: "report_id,bus_number" });
  return { error };
}

export async function fetchBusCumulative() {
  if (!supabase) return [];
  const { data } = await supabase.from("v_bus_cumulative").select("*");
  return data || [];
}

// ─── Fee Collection ──────────────────────────────────────────────────────────
export async function fetchFeeCollection(reportId) {
  if (!supabase) return [];
  const { data } = await supabase
    .from("dr_fee_collection")
    .select("*")
    .eq("report_id", reportId)
    .order("standard_class");
  return data || [];
}

export async function upsertFeeCollection(reportId, rows) {
  if (!supabase) return { error: "Supabase not configured" };
  const records = rows.map((r) => ({
    report_id: reportId,
    standard_class: r.standard_class,
    fee_type: r.fee_type,
    amount: r.amount || 0,
    payment_method: r.payment_method || "",
    entered_by: r.entered_by || "accounting",
  }));
  const { error } = await supabase
    .from("dr_fee_collection")
    .upsert(records, { onConflict: "report_id,standard_class,fee_type" });
  return { error };
}

// ─── Staff Attendance ────────────────────────────────────────────────────────
export async function fetchStaffAttendance(reportId) {
  if (!supabase) return null;
  const { data } = await supabase
    .from("dr_staff_attendance")
    .select("*")
    .eq("report_id", reportId)
    .single();
  return data;
}

export async function upsertStaffAttendance(reportId, attendance) {
  if (!supabase) return { error: "Supabase not configured" };
  const { error } = await supabase
    .from("dr_staff_attendance")
    .upsert([{
      report_id: reportId,
      total_staff: attendance.total_staff || 0,
      present: attendance.present || 0,
      on_leave: attendance.on_leave || 0,
      entered_by: attendance.entered_by || "admin",
    }], { onConflict: "report_id" });
  return { error };
}

// ─── Daily Report Notes ──────────────────────────────────────────────────────
export async function updateReportNotes(reportId, notes) {
  if (!supabase) return { error: "Supabase not configured" };
  const { error } = await supabase
    .from("daily_reports")
    .update({ notes, updated_at: new Date().toISOString() })
    .eq("id", reportId);
  return { error };
}
