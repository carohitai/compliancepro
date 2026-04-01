import { useState, useEffect } from "react";
import {
  fetchSubmissions, fetchSubmissionDetail, getFileUrl, isSupabaseEnabled,
} from "../../lib/supabase";

const DASHBOARD_PASSWORD = import.meta.env.VITE_DASHBOARD_PASSWORD || "ka@admin2025";

// ─── Login ────────────────────────────────────────────────────────────────────
function DashboardLogin({ onLogin }) {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    if (pwd === DASHBOARD_PASSWORD) {
      sessionStorage.setItem("ka_dash_auth", "1");
      onLogin();
    } else {
      setError("Incorrect password. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-[#0f2548] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
        <div className="flex justify-center mb-6">
          <div className="flex gap-1">
            {["K", "&", "A"].map((ch, i) => (
              <div key={i} className="w-10 h-11 bg-[#8ab45a] flex items-center justify-center rounded-sm">
                <span className="text-[#1a3a6b] font-serif font-bold text-lg">{ch}</span>
              </div>
            ))}
          </div>
        </div>
        <h2 className="text-center font-bold text-xl text-[#1a3a6b] mb-1">K&A Dashboard</h2>
        <p className="text-center text-sm text-gray-500 mb-6">Kolte &amp; Associates LLP — Staff Only</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Access Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]"
              placeholder="Enter dashboard password"
              value={pwd}
              onChange={(e) => { setPwd(e.target.value); setError(""); }}
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button type="submit" className="w-full bg-[#1a3a6b] hover:bg-[#152f59] text-white font-bold py-3 rounded-xl text-sm transition-all">
            Sign In
          </button>
        </form>
        {!isSupabaseEnabled && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
            ⚠ Supabase not configured — database features unavailable. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Client Detail Modal ──────────────────────────────────────────────────────
function ClientDetailModal({ submissionId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [fileUrls, setFileUrls] = useState({});

  useEffect(() => {
    fetchSubmissionDetail(submissionId).then(({ submission, files }) => {
      setData({ submission, files });
      setLoading(false);
    });
  }, [submissionId]);

  async function openFile(path, fileId) {
    if (fileUrls[fileId]) { window.open(fileUrls[fileId], "_blank"); return; }
    const url = await getFileUrl(path);
    if (url) { setFileUrls((p) => ({ ...p, [fileId]: url })); window.open(url, "_blank"); }
  }

  if (loading) return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#1a3a6b] border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-sm text-gray-600">Loading client data…</p>
      </div>
    </div>
  );

  const { submission: s, files } = data;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#1a3a6b] text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="font-bold text-lg">{s.name}</h3>
            <p className="text-blue-200 text-xs">{s.email} · {s.mobile}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Inner tabs */}
        <div className="border-b border-gray-200 px-6 flex gap-1 flex-shrink-0">
          {[["info","Info"], ["files","Files & AI"], ["registration","Registrations"]].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors
                ${activeTab === id ? "border-[#1a3a6b] text-[#1a3a6b]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              {label} {id === "files" && files.length > 0 && <span className="bg-[#1a3a6b] text-white text-xs px-1.5 py-0.5 rounded-full ml-1">{files.length}</span>}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* INFO TAB */}
          {activeTab === "info" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Portal Type", s.portal_type],
                  ["Report Type", s.report_type],
                  ["Constitution", s.constitution],
                  ["Financial Year", s.financial_year || s.assessment_year],
                  ["Sector", s.sector_group],
                  ["Nature", s.nature_label],
                  ["Purpose", s.purpose],
                  ["Loan Type", s.loan_type],
                  ["Submitted", new Date(s.created_at).toLocaleString("en-IN")],
                  ["Consent", s.consent_given ? "✓ Given" : "✗ Not given"],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
              {s.address && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">Address</p>
                  <p className="text-sm text-gray-800">{s.address}</p>
                </div>
              )}
            </div>
          )}

          {/* FILES & AI TAB */}
          {activeTab === "files" && (
            <div className="space-y-4">
              {files.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">No files uploaded for this submission.</p>
              ) : (
                files.map((f) => {
                  const ext = f.file_name.split(".").pop().toLowerCase();
                  const icon = ext === "pdf" ? "📄" : ext.startsWith("xls") ? "📊" : "📝";
                  const a = f.ai_assessment;
                  return (
                    <div key={f.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      {/* File header */}
                      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{icon}</span>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{f.file_name}</p>
                            <p className="text-xs text-gray-500">{(f.file_size / 1024).toFixed(0)} KB · {new Date(f.created_at).toLocaleDateString("en-IN")}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => openFile(f.storage_path, f.id)}
                          className="text-xs bg-[#1a3a6b] text-white px-3 py-1.5 rounded-lg hover:bg-[#152f59] transition-all"
                        >
                          Open File
                        </button>
                      </div>

                      {/* AI Assessment */}
                      {a ? (
                        <div className="p-4 space-y-3 text-sm">
                          {a.summary && (
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                              <p className="text-xs font-bold text-blue-700 mb-1">AI Summary</p>
                              <p className="text-gray-700">{a.summary}</p>
                            </div>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {a.bank_accounts?.length > 0 && (
                              <AssessSection title="🏦 Bank Accounts" items={a.bank_accounts.map((b) => `${b.bank} ${b.account_last4 ? `(…${b.account_last4})` : ""} ${b.type || ""} ${b.balance ? `· ₹${b.balance}` : ""}`)} />
                            )}
                            {a.loan_accounts?.length > 0 && (
                              <AssessSection title="💰 Loan Accounts" items={a.loan_accounts.map((l) => `${l.lender} – ${l.loan_type || ""} ${l.outstanding ? `· O/S ₹${l.outstanding}` : ""}`)} />
                            )}
                            {a.properties?.length > 0 && (
                              <AssessSection title="🏠 Properties" items={a.properties.map((p) => `${p.description} · ${p.location} ${p.value ? `· ₹${p.value}` : ""}`)} />
                            )}
                            {a.turnover?.length > 0 && (
                              <AssessSection title="📊 Turnover / Income" items={a.turnover.map((t) => `${t.year}: ₹${t.amount} (${t.type || ""})`)} />
                            )}
                            {a.promoters?.length > 0 && (
                              <AssessSection title="👤 Promoters / Partners" items={a.promoters} />
                            )}
                            {a.key_observations?.length > 0 && (
                              <AssessSection title="📝 Key Observations" items={a.key_observations} />
                            )}
                          </div>
                          {a.compliance_flags?.length > 0 && (
                            <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                              <p className="text-xs font-bold text-red-700 mb-2">⚠ Compliance Flags</p>
                              {a.compliance_flags.map((flag, i) => (
                                <p key={i} className="text-xs text-red-700 flex items-start gap-1"><span>•</span>{flag}</p>
                              ))}
                            </div>
                          )}
                          {a.tax_details && Object.values(a.tax_details).some(Boolean) && (
                            <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                              <p className="text-xs font-bold text-[#4a7c59] mb-2">Tax Registration Details</p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {Object.entries(a.tax_details).filter(([,v]) => v).map(([k, v]) => (
                                  <div key={k}><span className="text-gray-500 uppercase">{k.replace(/_/g, " ")}: </span><span className="font-mono font-bold">{v}</span></div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-400">
                          {f.assessment_error
                            ? <p className="text-red-500">AI assessment failed: {f.assessment_error}</p>
                            : <p>AI assessment pending…</p>}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* REGISTRATIONS TAB */}
          {activeTab === "registration" && (
            <div>
              {s.registrations && Object.keys(s.registrations).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(s.registrations).filter(([, v]) => v?.enabled).map(([key, val]) => (
                    <div key={key} className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3">
                      <span className="text-green-500 text-lg">✓</span>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">{key.toUpperCase()}</p>
                        <p className="font-mono font-bold text-sm text-[#1a3a6b]">{val.number || "—"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-8">No registration details available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AssessSection({ title, items }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs font-bold text-gray-600 mb-2">{title}</p>
      {items.map((item, i) => (
        <p key={i} className="text-xs text-gray-700 py-0.5 border-b border-gray-100 last:border-0">{item}</p>
      ))}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard({ onHome }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("ka_dash_auth") === "1");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    fetchSubmissions({ limit: 100 }).then(({ data }) => {
      setSubmissions(data);
      setLoading(false);
    });
  }, [authed]);

  if (!authed) return <DashboardLogin onLogin={() => setAuthed(true)} />;

  const filtered = submissions.filter((s) => {
    const matchSearch = !search || [s.name, s.email, s.mobile, s.sector_group, s.nature_label]
      .some((v) => v?.toLowerCase().includes(search.toLowerCase()));
    const matchType = filterType === "all" || s.portal_type === filterType || s.report_type === filterType;
    return matchSearch && matchType;
  });

  const stats = {
    total:       submissions.length,
    client:      submissions.filter((s) => s.portal_type === "client").length,
    professional: submissions.filter((s) => s.portal_type === "professional").length,
    today:       submissions.filter((s) => new Date(s.created_at).toDateString() === new Date().toDateString()).length,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <header className="bg-[#1a3a6b] text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-0.5">
            {["K", "&", "A"].map((ch, i) => (
              <div key={i} className="w-6 h-7 bg-[#8ab45a] flex items-center justify-center rounded-sm">
                <span className="text-[#1a3a6b] font-serif font-bold text-xs">{ch}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="font-bold text-sm">K&amp;A Dashboard</p>
            <p className="text-blue-300 text-xs">Kolte &amp; Associates LLP — Staff Portal</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onHome} className="text-blue-200 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">← Public Site</button>
          <button onClick={() => { sessionStorage.removeItem("ka_dash_auth"); setAuthed(false); }} className="text-blue-200 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">Sign Out</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Submissions", value: stats.total, color: "bg-[#1a3a6b]" },
            { label: "Client Portal",     value: stats.client, color: "bg-[#4a7c59]" },
            { label: "Professional Tool", value: stats.professional, color: "bg-[#8ab45a]" },
            { label: "Today",             value: stats.today, color: "bg-amber-500" },
          ].map((s) => (
            <div key={s.label} className={`${s.color} text-white rounded-xl p-4`}>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm opacity-80 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {!isSupabaseEnabled && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-sm text-amber-800">
            <strong>⚠ Supabase not connected.</strong> Add <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_URL</code> and <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code> file and redeploy.
            See <code>supabase/schema.sql</code> for the database setup instructions.
          </div>
        )}

        {/* Search & Filter */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3">
          <input
            className="flex-1 min-w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]"
            placeholder="Search by name, email, mobile…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] bg-white"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="client">Client Portal</option>
            <option value="professional">Professional Tool</option>
            <option value="compliance">Compliance Report</option>
            <option value="requirement">Requirement Report</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-800 text-sm">Client Submissions ({filtered.length})</h3>
            <p className="text-xs text-gray-400">Click any row to view details</p>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-[#1a3a6b] border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-sm text-gray-500">Loading submissions…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              {isSupabaseEnabled ? "No submissions found." : "Connect Supabase to view submissions."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Contact</th>
                    <th className="px-4 py-3 text-left font-semibold">Nature</th>
                    <th className="px-4 py-3 text-left font-semibold">Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Purpose</th>
                    <th className="px-4 py-3 text-left font-semibold">Files</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((s) => (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedId(s.id)}
                      className="hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(s.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{s.name || "—"}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        <p>{s.email}</p>
                        <p>{s.mobile}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">{s.nature_label || s.constitution || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                          ${s.portal_type === "client" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                          {s.portal_type === "client" ? "Client" : "Professional"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 capitalize">{s.report_type || s.purpose || "—"}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-[#1a3a6b]">
                        {s.file_count > 0 ? `${s.file_count} file${s.file_count > 1 ? "s" : ""}` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail modal */}
      {selectedId && (
        <ClientDetailModal submissionId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
