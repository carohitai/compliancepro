import { useState } from "react";
import { ASSIGNMENTS } from "../data/requirements";

export default function AssignmentSelector({ clientInfo, onNext, onBack }) {
  const [selected, setSelected] = useState([]);

  function toggle(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const descriptions = {
    itr: "Filing of annual Income Tax Return for individual, firm, company or other entity",
    tds: "TDS deduction, payment challans, quarterly return filing and certificate issuance",
    accounting: "Complete bookkeeping, ledger maintenance and financial statement preparation",
    it_audit: "Tax audit under Section 44AB – Form 3CA/3CB/3CD preparation and filing",
    gst: "GST return filing (GSTR-1 & 3B), ITC reconciliation and GST compliance",
    gst_audit: "Annual GSTR-9 and GSTR-9C reconciliation statement filing",
    project_finance: "Preparation of project reports, CMA data and loan documentation",
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Client summary pill */}
        <div className="flex flex-wrap gap-3 mb-6 p-3 bg-green-50 rounded-xl border border-green-100">
          <span className="text-sm font-semibold text-[#4a7c59]">{clientInfo.name}</span>
          {clientInfo.tradeName && (
            <>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-600">{clientInfo.tradeName}</span>
            </>
          )}
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-600">{clientInfo.constitution}</span>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-600">FY {clientInfo.financialYear}</span>
        </div>

        <h3 className="text-base font-bold text-gray-800 mb-1">Select Assignment(s)</h3>
        <p className="text-xs text-gray-500 mb-5">Choose one or more assignments. A tailored requirement checklist will be generated for each.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ASSIGNMENTS.map(({ id, label, icon }) => {
            const isSelected = selected.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggle(id)}
                className={`text-left p-4 rounded-xl border-2 transition-all hover:shadow-md focus:outline-none
                  ${isSelected
                    ? "border-[#4a7c59] bg-green-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-semibold text-sm ${isSelected ? "text-[#4a7c59]" : "text-gray-800"}`}>
                        {label}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all
                          ${isSelected ? "border-[#4a7c59] bg-[#4a7c59]" : "border-gray-300"}`}
                      >
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{descriptions[id]}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {selected.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-700">
            <strong>{selected.length}</strong> assignment{selected.length > 1 ? "s" : ""} selected — a consolidated requirement report will be generated.
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold px-6 py-3 rounded-xl transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button
          type="button"
          disabled={selected.length === 0}
          onClick={() => onNext(selected)}
          className="bg-[#4a7c59] hover:bg-[#3d6b4a] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-xl shadow-sm transition-all flex items-center gap-2"
        >
          Generate Report
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
