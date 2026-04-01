import { useState, useEffect } from "react";
import { fetchFromAirtable, isAirtableEnabled } from "../../lib/airtable";

const DASHBOARD_PASSWORD = import.meta.env.VITE_DASHBOARD_PASSWORD || "ka@admin2025";
const AIRTABLE_BASE_ID   = import.meta.env.VITE_AIRTABLE_BASE_ID   || "";

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
        <h2 className="text-center font-bold text-xl text-[#1a3a6b] mb-1">K&amp;A Dashboard</h2>
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
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard({ onHome }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("ka_dash_auth") === "1");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!authed || !isAirtableEnabled) return;
    setLoading(true);
    fetchFromAirtable().then(({ records: r }) => {
      setRecords(r);
      setLoading(false);
    });
  }, [authed]);

  if (!authed) return <DashboardLogin onLogin={() => setAuthed(true)} />;

  const filtered = records.filter((r) => {
    if (!search) return true;
    const f = r.fields;
    return [f["Name"], f["Email"], f["Mobile"], f["Sector Group"], f["Nature of Business"]]
      .some((v) => v?.toLowerCase().includes(search.toLowerCase()));
  });

  const stats = {
    total:      records.length,
    portal:     records.filter((r) => r.fields["Portal Type"] === "Client Portal").length,
    pro:        records.filter((r) => r.fields["Portal Type"] === "Professional Tool").length,
    today:      records.filter((r) => {
      const d = r.fields["Submitted At"];
      return d && new Date(d).toDateString() === new Date().toDateString();
    }).length,
  };

  const airtableUrl = AIRTABLE_BASE_ID
    ? `https://airtable.com/${AIRTABLE_BASE_ID}`
    : "https://airtable.com";

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
            <p className="text-blue-300 text-xs">Kolte &amp; Associates LLP</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={airtableUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#8ab45a] hover:bg-[#7aa34a] text-[#1a3a6b] font-bold text-xs px-3 py-1.5 rounded-lg transition-all"
          >
            <span>📊</span> Open Full Airtable
          </a>
          <button onClick={onHome} className="text-blue-200 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">← Public Site</button>
          <button onClick={() => { sessionStorage.removeItem("ka_dash_auth"); setAuthed(false); }} className="text-blue-200 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">Sign Out</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">

        {/* Airtable not configured warning */}
        {!isAirtableEnabled && (
          <div className="bg-white rounded-2xl border border-amber-200 overflow-hidden">
            <div className="bg-amber-50 px-6 py-4 border-b border-amber-200">
              <h2 className="font-bold text-amber-800 text-base flex items-center gap-2">
                <span>⚠️</span> Airtable Not Connected Yet
              </h2>
              <p className="text-amber-700 text-sm mt-1">Follow these steps to connect your Airtable database:</p>
            </div>
            <div className="px-6 py-5 space-y-5">

              {/* Step 1 */}
              <SetupStep num={1} title="Create a free Airtable account">
                <p>Go to <strong>airtable.com</strong> → click <strong>Sign up for free</strong> → use your K&amp;A email.</p>
              </SetupStep>

              {/* Step 2 */}
              <SetupStep num={2} title='Create a Base called "CompliancePro"'>
                <p>After login → click <strong>+ Create a base</strong> → choose <strong>Start from scratch</strong> → name it <strong>CompliancePro</strong>.</p>
              </SetupStep>

              {/* Step 3 */}
              <SetupStep num={3} title='Rename the default table to "Client Submissions"'>
                <p>Click the tab that says <strong>Table 1</strong> at the top → right-click → <strong>Rename</strong> → type <strong>Client Submissions</strong> → press Enter.</p>
              </SetupStep>

              {/* Step 4 */}
              <SetupStep num={4} title="Add these columns (fields) to the table">
                <p className="mb-2">Click the <strong>+</strong> button on the right of the last column to add each field. Set the type shown:</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
                    <thead><tr className="bg-[#1a3a6b] text-white"><th className="px-3 py-2 text-left">Field Name</th><th className="px-3 py-2 text-left">Field Type</th></tr></thead>
                    <tbody>
                      {[
                        ["Portal Type",         "Single line text"],
                        ["Report Type",         "Single line text"],
                        ["Name",                "Single line text"],
                        ["Email",               "Email"],
                        ["Mobile",              "Phone number"],
                        ["BAC Sector",          "Single line text"],
                        ["Sector Group",        "Single line text"],
                        ["Nature of Business",  "Single line text"],
                        ["Constitution",        "Single line text"],
                        ["Financial Year",      "Single line text"],
                        ["Purpose",             "Single line text"],
                        ["Loan Type",           "Single line text"],
                        ["Registrations",       "Long text"],
                        ["Selected Assignments","Long text"],
                        ["Uploaded Files",      "Long text"],
                        ["Consent Given",       "Checkbox"],
                        ["Consent At",          "Single line text"],
                        ["Submitted At",        "Single line text"],
                      ].map(([name, type], i) => (
                        <tr key={name} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-3 py-2 font-semibold">{name}</td>
                          <td className="px-3 py-2 text-gray-500">{type}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SetupStep>

              {/* Step 5 */}
              <SetupStep num={5} title="Get your Base ID">
                <p>Look at the URL in your browser when you have the base open. It looks like:</p>
                <code className="block bg-gray-100 rounded-lg px-3 py-2 text-xs mt-2 font-mono">
                  https://airtable.com/<strong className="text-[#1a3a6b]">appXXXXXXXXXXXXXX</strong>/tblXXXXXX...
                </code>
                <p className="mt-2">Copy the part that starts with <strong>app</strong> (highlighted above). That is your <strong>Base ID</strong>.</p>
              </SetupStep>

              {/* Step 6 */}
              <SetupStep num={6} title="Create a Personal Access Token">
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Go to <strong>airtable.com/create/tokens</strong></li>
                  <li>Click <strong>+ Create new token</strong></li>
                  <li>Name it <strong>CompliancePro</strong></li>
                  <li>Under <strong>Scopes</strong> — add: <code className="bg-gray-100 px-1 rounded text-xs">data.records:read</code> and <code className="bg-gray-100 px-1 rounded text-xs">data.records:write</code></li>
                  <li>Under <strong>Access</strong> — select your <strong>CompliancePro</strong> base</li>
                  <li>Click <strong>Create token</strong> — copy and save it immediately (shown only once)</li>
                </ol>
              </SetupStep>

              {/* Step 7 */}
              <SetupStep num={7} title="Add the keys to GitHub (so the live site works)">
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Go to <strong>github.com/carohitai/compliancepro</strong></li>
                  <li>Click <strong>Settings</strong> → <strong>Secrets and variables</strong> → <strong>Actions</strong></li>
                  <li>Click <strong>New repository secret</strong> and add these 3 secrets:</li>
                </ol>
                <div className="mt-3 space-y-2">
                  {[
                    ["VITE_AIRTABLE_TOKEN",   "The token you copied in step 6 (starts with pat...)"],
                    ["VITE_AIRTABLE_BASE_ID", "The Base ID from step 5 (starts with app...)"],
                    ["VITE_DASHBOARD_PASSWORD","A password for your K&A team to access this dashboard"],
                  ].map(([name, desc]) => (
                    <div key={name} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <p className="font-mono font-bold text-xs text-[#1a3a6b]">{name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                    </div>
                  ))}
                </div>
              </SetupStep>

              {/* Step 8 */}
              <SetupStep num={8} title="Update the GitHub Actions workflow to pass env vars">
                <p className="text-sm">The workflow file needs to know about these secrets when building. This is already configured in the deploy.yml file — you just need to push a small change to re-trigger it, or manually run the workflow:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm mt-2">
                  <li>Go to <strong>github.com/carohitai/compliancepro/actions</strong></li>
                  <li>Click the <strong>Deploy to GitHub Pages</strong> workflow</li>
                  <li>Click <strong>Run workflow</strong> → <strong>Run workflow</strong></li>
                </ol>
              </SetupStep>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                <p className="font-bold mb-1">✅ Once done:</p>
                <p>Every time a client fills the form on your portal, their data will appear in your Airtable base automatically. You can view, filter, sort and export it from Airtable — no coding needed.</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats — only show if Airtable is connected */}
        {isAirtableEnabled && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Submissions", value: stats.total,  color: "bg-[#1a3a6b]" },
                { label: "Client Portal",     value: stats.portal, color: "bg-[#4a7c59]" },
                { label: "Professional Tool", value: stats.pro,    color: "bg-[#8ab45a]" },
                { label: "Today",             value: stats.today,  color: "bg-amber-500" },
              ].map((s) => (
                <div key={s.label} className={`${s.color} text-white rounded-xl p-4`}>
                  <p className="text-3xl font-bold">{s.value}</p>
                  <p className="text-sm opacity-80 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Open Airtable CTA */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-bold text-gray-800">View full database in Airtable</p>
                <p className="text-sm text-gray-500 mt-0.5">Filter, sort, search and export all client data from Airtable directly.</p>
              </div>
              <a
                href={airtableUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1a3a6b] hover:bg-[#152f59] text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2"
              >
                <span>📊</span> Open Airtable Dashboard
              </a>
            </div>

            {/* Search + table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
                <input
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]"
                  placeholder="Quick search by name, email, mobile…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin w-6 h-6 border-2 border-[#1a3a6b] border-t-transparent rounded-full mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Loading…</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
                        {["Date", "Name", "Email", "Mobile", "Type", "Sector / Nature", "Purpose / FY"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filtered.length === 0 ? (
                        <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No submissions yet.</td></tr>
                      ) : filtered.map((r) => {
                        const f = r.fields;
                        return (
                          <tr key={r.id} className="hover:bg-blue-50 transition-colors">
                            <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                              {f["Submitted At"] ? new Date(f["Submitted At"]).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                            </td>
                            <td className="px-4 py-3 font-semibold">{f["Name"] || "—"}</td>
                            <td className="px-4 py-3 text-xs text-gray-500">{f["Email"] || "—"}</td>
                            <td className="px-4 py-3 text-xs text-gray-500">{f["Mobile"] || "—"}</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${f["Portal Type"] === "Client Portal" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                                {f["Portal Type"] === "Client Portal" ? "Client" : "Pro"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-600">{f["Nature of Business"] || f["Constitution"] || "—"}</td>
                            <td className="px-4 py-3 text-xs text-gray-600 capitalize">{f["Purpose"] || f["Financial Year"] || "—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SetupStep({ num, title, children }) {
  return (
    <div className="flex gap-4">
      <div className="w-7 h-7 rounded-full bg-[#1a3a6b] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{num}</div>
      <div className="flex-1">
        <p className="font-bold text-gray-800 text-sm mb-2">{title}</p>
        <div className="text-sm text-gray-600 space-y-1">{children}</div>
      </div>
    </div>
  );
}
