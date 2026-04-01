export default function ReportTypeSelector({ clientInfo, onSelect, onBack }) {
  return (
    <div className="space-y-6">
      {/* Client pill */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-wrap items-center gap-3 mb-1">
          <span className="text-base font-bold text-gray-800">{clientInfo.name}</span>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-600">{clientInfo.email}</span>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-600">{clientInfo.mobile}</span>
        </div>
        <p className="text-xs text-gray-500">
          {clientInfo.sector?.label} &nbsp;·&nbsp; {clientInfo.nature?.label}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-base font-bold text-gray-800 mb-1">Select Report Type</h3>
        <p className="text-xs text-gray-500 mb-6">Choose what you want to generate for this client</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Compliance Report */}
          <button
            onClick={() => onSelect("compliance")}
            className="group text-left p-5 rounded-xl border-2 border-gray-200 hover:border-[#1a3a6b] hover:bg-blue-50 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1a3a6b]/10 flex items-center justify-center mb-3 group-hover:bg-[#1a3a6b]/20">
              <span className="text-xl">📊</span>
            </div>
            <h4 className="font-bold text-gray-800 mb-1 group-hover:text-[#1a3a6b]">Compliance Report</h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">
              Visual, sector-specific compliance report with due dates, TDS limits, cash limits, turnover thresholds and key amendments — with your name on it.
            </p>
            <ul className="text-xs space-y-1">
              {["Assessment year selection", "Compliance, Due Dates, Limits & What Matters tabs", "Charts & visual summaries", "Downloadable PDF"].map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-[#4a7c59]">
                  <span>✓</span> {f}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center gap-1 text-[#1a3a6b] text-sm font-semibold">
              Generate Compliance Report
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Requirement Report */}
          <button
            onClick={() => onSelect("requirement")}
            className="group text-left p-5 rounded-xl border-2 border-gray-200 hover:border-[#4a7c59] hover:bg-green-50 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[#4a7c59]/10 flex items-center justify-center mb-3 group-hover:bg-[#4a7c59]/20">
              <span className="text-xl">📋</span>
            </div>
            <h4 className="font-bold text-gray-800 mb-1 group-hover:text-[#4a7c59]">Requirement Report</h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">
              Client-specific requirement checklist. Upload existing documents for context, select the purpose and get a tailored list — including loan interest rates.
            </p>
            <ul className="text-xs space-y-1">
              {["Upload PDFs, Excel or Word files", "Purpose-specific checklist", "Loan type with bank rate comparison", "Professional PDF export"].map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-[#4a7c59]">
                  <span>✓</span> {f}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center gap-1 text-[#4a7c59] text-sm font-semibold">
              Build Requirement Report
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      <div className="flex">
        <button onClick={onBack} className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>
    </div>
  );
}
