export default function HomeScreen({ onSelectMode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2548] via-[#1a3a6b] to-[#1a3a6b] flex flex-col">
      {/* Header */}
      <header className="px-4 sm:px-6 py-4 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="flex gap-0.5">
            {["K", "&", "A"].map((ch, i) => (
              <div key={i} className="w-8 h-9 bg-[#8ab45a] flex items-center justify-center rounded-sm">
                <span className="text-[#1a3a6b] font-serif font-bold text-base">{ch}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight">Kolte &amp; Associates LLP</p>
            <p className="text-blue-300 text-xs leading-tight">Compliance Pro</p>
          </div>
        </div>
        <span className="text-blue-300 text-xs">FY 2025-26</span>
      </header>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 text-center">
        <div className="inline-block bg-[#8ab45a]/20 border border-[#8ab45a]/40 rounded-full px-4 py-1.5 text-[#8ab45a] text-xs font-semibold uppercase tracking-widest mb-5">
          Compliance &amp; Requirements Platform
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 leading-tight px-2">
          Compliance done right.
        </h1>
        <p className="text-blue-300 text-sm max-w-lg mb-8 sm:mb-12 px-2">
          Select a service below — compliance reports, requirement checklists, debt sourcing, or your personalised New Income Tax Act 2025 guide.
        </p>

        {/* Mode cards — 2×2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full max-w-3xl px-0">

          {/* 1. Compliance Report */}
          <button
            onClick={() => onSelectMode("compliance-report")}
            className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#8ab45a]/60 rounded-2xl p-4 sm:p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-xl bg-[#1a3a6b]/40 border border-white/20 flex items-center justify-center mb-4 group-hover:bg-[#1a3a6b]/60 transition-all">
              <span className="text-2xl">📊</span>
            </div>
            <h2 className="text-white font-bold text-lg mb-2">Compliance Report</h2>
            <p className="text-blue-300 text-sm leading-relaxed mb-4">
              Sector-specific compliance report with due dates, TDS &amp; turnover limits, key amendments and charts.
            </p>
            <div className="flex flex-col gap-1.5 text-xs mb-5">
              {["Assessment year selection", "Due dates &amp; compliance limits", "Charts &amp; visual summaries", "Downloadable PDF"].map((f) => (
                <span key={f} className="flex items-center gap-2 text-[#8ab45a]">
                  <span>✓</span> <span dangerouslySetInnerHTML={{ __html: f }} />
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-[#8ab45a] text-sm font-semibold">
              Generate Report
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* 2. Compliance Requirements Checklist */}
          <button
            onClick={() => onSelectMode("requirements-checklist")}
            className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#4a7c59]/70 rounded-2xl p-4 sm:p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-xl bg-[#4a7c59]/20 flex items-center justify-center mb-4 group-hover:bg-[#4a7c59]/35 transition-all">
              <span className="text-2xl">📋</span>
            </div>
            <h2 className="text-white font-bold text-lg mb-2">Compliance Requirements Checklist</h2>
            <p className="text-blue-300 text-sm leading-relaxed mb-4">
              Client-specific document checklist for Income Tax, TDS, GST, Accounting, Audit and more.
            </p>
            <div className="flex flex-col gap-1.5 text-xs mb-5">
              {["ITR, TDS, GST Returns", "Tax Audit, GST Audit", "Accounting / Bookkeeping", "Upload docs for context"].map((f) => (
                <span key={f} className="flex items-center gap-2 text-[#4a7c59] text-opacity-80">
                  <span className="text-[#8ab45a]">✓</span> {f}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-[#8ab45a] text-sm font-semibold">
              Build Checklist
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* 3. Debt Sourcing Checklist */}
          <button
            onClick={() => onSelectMode("debt-sourcing")}
            className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/60 rounded-2xl p-4 sm:p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center mb-4 group-hover:bg-amber-500/25 transition-all">
              <span className="text-2xl">🏦</span>
            </div>
            <h2 className="text-white font-bold text-lg mb-2">Debt Sourcing Checklist</h2>
            <p className="text-blue-300 text-sm leading-relaxed mb-4">
              Loan application document checklist with live bank rate comparison across public, private and NBFCs.
            </p>
            <div className="flex flex-col gap-1.5 text-xs mb-5">
              {["Home, Business &amp; MSME loans", "LAP, Working Capital, Term Loans", "Current bank interest rate table", "Project finance documents"].map((f) => (
                <span key={f} className="flex items-center gap-2 text-amber-300">
                  <span>✓</span> <span dangerouslySetInnerHTML={{ __html: f }} />
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-amber-300 text-sm font-semibold">
              Get Loan Checklist
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* 4. New Income Tax Act 2025 */}
          <button
            onClick={() => onSelectMode("whatchanges")}
            className="group relative bg-gradient-to-br from-amber-500/15 to-orange-500/10 hover:from-amber-500/25 hover:to-orange-500/20 border border-amber-400/30 hover:border-amber-400/70 rounded-2xl p-4 sm:p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02] overflow-hidden"
          >
            <div className="absolute top-3 right-3 bg-amber-400 text-[#0f2548] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
              New Act
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 flex items-center justify-center mb-4 group-hover:bg-amber-400/30 transition-all">
              <span className="text-2xl">🆕</span>
            </div>
            <h2 className="text-white font-bold text-lg mb-2">New Income Tax Act 2025</h2>
            <p className="text-blue-300 text-sm leading-relaxed mb-4">
              Personalised guide to what changes for your entity under the New Income Tax Act 2025 — effective TY 2026-27.
            </p>
            <div className="flex flex-col gap-1.5 text-xs mb-5">
              {["Change in Nomenclature", "Changes in Operations", "Change in Rates", "What Does Not Change"].map((f) => (
                <span key={f} className="flex items-center gap-2 text-amber-300">
                  <span>✓</span> {f}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-amber-300 text-sm font-semibold">
              Get My Guide
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

        </div>

        <p className="text-blue-400/50 text-xs mt-10">
          Knowledge base: incometaxindia.gov.in · gst.gov.in · taxmann.in &nbsp;|&nbsp; FY 2025-26
        </p>
      </div>
    </div>
  );
}
