export default function HomeScreen({ onSelectMode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2548] via-[#1a3a6b] to-[#1a3a6b] flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="flex gap-0.5">
            {["K", "&", "A"].map((ch, i) => (
              <div key={i} className="w-8 h-9 bg-[#8ab45a] flex items-center justify-center rounded-sm">
                <span className="text-[#1a3a6b] font-serif font-bold text-base">{ch}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight">K &amp; A</p>
            <p className="text-blue-300 text-xs leading-tight">Compliance Pro</p>
          </div>
        </div>
        <span className="text-blue-300 text-xs">FY 2024-25</span>
      </header>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="inline-block bg-[#8ab45a]/20 border border-[#8ab45a]/40 rounded-full px-4 py-1.5 text-[#8ab45a] text-xs font-semibold uppercase tracking-widest mb-6">
          Compliance & Requirements Platform
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
          What would you like to do today?
        </h1>
        <p className="text-blue-300 text-sm max-w-md mb-12">
          Choose the portal that fits your need — generate a compliance report for a client or prepare a professional requirement checklist.
        </p>

        {/* Mode cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl">
          {/* Client Portal */}
          <button
            onClick={() => onSelectMode("portal")}
            className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#8ab45a]/60 rounded-2xl p-7 text-left transition-all hover:shadow-xl hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-xl bg-[#8ab45a]/20 flex items-center justify-center mb-4 group-hover:bg-[#8ab45a]/30 transition-all">
              <span className="text-2xl">🏢</span>
            </div>
            <h2 className="text-white font-bold text-lg mb-2">Client Portal</h2>
            <p className="text-blue-300 text-sm leading-relaxed mb-4">
              Enter client's basic details, select their business sector and generate a
              <strong className="text-white"> Compliance Report</strong> or
              <strong className="text-white"> Requirement Checklist</strong>.
            </p>
            <div className="flex flex-col gap-1.5 text-xs">
              <span className="flex items-center gap-2 text-[#8ab45a]">
                <span>✓</span> Compliance Report with charts & due dates
              </span>
              <span className="flex items-center gap-2 text-[#8ab45a]">
                <span>✓</span> TDS / Cash / Turnover limits
              </span>
              <span className="flex items-center gap-2 text-[#8ab45a]">
                <span>✓</span> Requirement checklist with loan rates
              </span>
            </div>
            <div className="mt-5 flex items-center gap-1 text-[#8ab45a] text-sm font-semibold">
              Open Client Portal
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Professional Tool */}
          <button
            onClick={() => onSelectMode("professional")}
            className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/60 rounded-2xl p-7 text-left transition-all hover:shadow-xl hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-400/10 flex items-center justify-center mb-4 group-hover:bg-blue-400/20 transition-all">
              <span className="text-2xl">📋</span>
            </div>
            <h2 className="text-white font-bold text-lg mb-2">Professional Tool</h2>
            <p className="text-blue-300 text-sm leading-relaxed mb-4">
              K&A staff tool to collect complete client information and generate
              <strong className="text-white"> assignment-specific requirement reports</strong> for all 7 categories.
            </p>
            <div className="flex flex-col gap-1.5 text-xs">
              <span className="flex items-center gap-2 text-blue-300">
                <span>✓</span> Income Tax, TDS, Accounting
              </span>
              <span className="flex items-center gap-2 text-blue-300">
                <span>✓</span> GST, IT Audit, GST Audit
              </span>
              <span className="flex items-center gap-2 text-blue-300">
                <span>✓</span> Project Finance documentation
              </span>
            </div>
            <div className="mt-5 flex items-center gap-1 text-blue-300 text-sm font-semibold">
              Open Professional Tool
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        <p className="text-blue-400/50 text-xs mt-10">
          Knowledge base: incometaxindia.gov.in · gst.gov.in · taxmann.in &nbsp;|&nbsp; FY 2024-25
        </p>
      </div>
    </div>
  );
}
