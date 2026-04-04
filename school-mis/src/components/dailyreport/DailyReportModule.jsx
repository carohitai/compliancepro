import { useState, useEffect } from "react";
import DailyReportLogin from "./DailyReportLogin";
import BookStockForm from "./forms/BookStockForm";
import AdmissionsForm from "./forms/AdmissionsForm";
import EnquiriesForm from "./forms/EnquiriesForm";
import BusFormsForm from "./forms/BusFormsForm";
import FeeCollectionForm from "./forms/FeeCollectionForm";
import StaffAttendanceForm from "./forms/StaffAttendanceForm";
import NotesForm from "./forms/NotesForm";
import ConsolidatedReport from "./report/ConsolidatedReport";
import { getOrCreateReport } from "../../lib/dailyReport";

const ROLE_SECTIONS = {
  admin: [
    { key: "admissions", label: "Admissions" },
    { key: "enquiries", label: "Enquiries" },
    { key: "bus", label: "School Bus" },
    { key: "attendance", label: "Attendance" },
    { key: "notes", label: "Notes" },
    { key: "report", label: "View Report" },
  ],
  accounting: [
    { key: "fees", label: "Fee Collection" },
    { key: "bus", label: "School Bus" },
    { key: "report", label: "View Report" },
  ],
  librarian: [
    { key: "books", label: "Book Stock" },
    { key: "notes", label: "Notes" },
  ],
};

export default function DailyReportModule() {
  const [role, setRole] = useState(() => {
    if (sessionStorage.getItem("smis_auth") === "1") return sessionStorage.getItem("smis_role");
    return null;
  });
  const [reportDate, setReportDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [reportId, setReportId] = useState(null);
  const [reportNotes, setReportNotes] = useState("");
  const [activeSection, setActiveSection] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!role) return;
    loadReport();
  }, [role, reportDate]);

  useEffect(() => {
    if (role) {
      const sections = ROLE_SECTIONS[role];
      if (sections?.length > 0) setActiveSection(sections[0].key);
    }
  }, [role]);

  async function loadReport() {
    setLoading(true);
    const { report, error } = await getOrCreateReport(reportDate);
    if (report) {
      setReportId(report.id);
      setReportNotes(report.notes || "");
    }
    setLoading(false);
  }

  function handleLogin(r) { setRole(r); }

  function handleLogout() {
    sessionStorage.removeItem("smis_auth");
    sessionStorage.removeItem("smis_role");
    setRole(null);
    setReportId(null);
  }

  if (!role) return <DailyReportLogin onLogin={handleLogin} />;

  const sections = ROLE_SECTIONS[role] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-indigo-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏫</span>
            <div>
              <p className="font-bold text-sm leading-tight">School MIS</p>
              <p className="text-xs text-indigo-200 leading-tight">
                {role === "admin" ? "Admin" : role === "accounting" ? "Accounting" : "Librarian"} — Daily Report
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="date"
              className="bg-indigo-800 text-white text-xs px-3 py-1.5 rounded-lg border border-indigo-600 focus:outline-none"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
            />
            <button
              onClick={handleLogout}
              className="text-xs text-indigo-300 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Section tabs */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {sections.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  activeSection === s.key
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading report data...</div>
        ) : !reportId ? (
          <div className="text-center py-12 text-gray-500">
            <p>Could not load report for {reportDate}.</p>
            <p className="text-xs mt-1">Ensure Supabase is configured in your .env file.</p>
          </div>
        ) : (
          <>
            {activeSection === "books" && <BookStockForm reportId={reportId} reportDate={reportDate} />}
            {activeSection === "admissions" && <AdmissionsForm reportId={reportId} />}
            {activeSection === "enquiries" && <EnquiriesForm reportId={reportId} />}
            {activeSection === "bus" && <BusFormsForm reportId={reportId} />}
            {activeSection === "fees" && <FeeCollectionForm reportId={reportId} />}
            {activeSection === "attendance" && <StaffAttendanceForm reportId={reportId} />}
            {activeSection === "notes" && <NotesForm reportId={reportId} initialNotes={reportNotes} />}
            {activeSection === "report" && (
              <ConsolidatedReport reportId={reportId} reportDate={reportDate} notes={reportNotes} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
