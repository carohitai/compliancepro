import { useRef } from "react";
import { ALL_REQUIREMENTS, REGISTRATION_TYPES } from "../data/requirements";

export default function RequirementReport({ clientInfo, selectedAssignments, onBack, onReset }) {
  const printRef = useRef(null);

  const enabledRegs = REGISTRATION_TYPES.filter(
    ({ key }) => clientInfo.registrations[key]?.enabled
  );

  function handlePrint() {
    window.print();
  }

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <button
          onClick={onBack}
          className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Edit Assignments
        </button>
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold px-5 py-2.5 rounded-xl transition-all text-sm"
          >
            New Client
          </button>
          <button
            onClick={handlePrint}
            className="bg-[#1a3a6b] hover:bg-[#152f59] text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Report */}
      <div ref={printRef} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden print-container">
        {/* Header */}
        <div className="bg-[#1a3a6b] text-white px-8 py-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">
                Compliance Requirement Report
              </p>
              <h1 className="text-2xl font-bold">{clientInfo.name}</h1>
              {clientInfo.tradeName && (
                <p className="text-blue-200 mt-0.5">Trading as: {clientInfo.tradeName}</p>
              )}
            </div>
            <div className="text-right text-sm text-blue-200">
              <p className="font-semibold text-white">FY {clientInfo.financialYear}</p>
              <p>{today}</p>
            </div>
          </div>
        </div>

        {/* Client summary ribbon */}
        <div className="bg-[#f0f7f3] border-b border-green-100 px-8 py-4">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div>
              <span className="text-gray-500 font-medium">Constitution: </span>
              <span className="font-semibold text-gray-800">{clientInfo.constitution}</span>
            </div>
            {clientInfo.address && (
              <div>
                <span className="text-gray-500 font-medium">Address: </span>
                <span className="font-semibold text-gray-800">{clientInfo.address}</span>
              </div>
            )}
            {clientInfo.email && (
              <div>
                <span className="text-gray-500 font-medium">Email: </span>
                <span className="font-semibold text-gray-800">{clientInfo.email}</span>
              </div>
            )}
            {clientInfo.phone && (
              <div>
                <span className="text-gray-500 font-medium">Phone: </span>
                <span className="font-semibold text-gray-800">{clientInfo.phone}</span>
              </div>
            )}
          </div>

          {/* Registrations */}
          {enabledRegs.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {enabledRegs.map(({ key, label }) => {
                const reg = clientInfo.registrations[key];
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 bg-white border border-green-200 text-green-800 text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    <span className="text-green-500">✓</span>
                    {label}
                    {reg.number && <span className="text-green-600 font-mono">{reg.number}</span>}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Assignments summary */}
        <div className="px-8 py-4 border-b border-gray-100 bg-gray-50">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Assignments Covered</p>
          <div className="flex flex-wrap gap-2">
            {selectedAssignments.map((id) => {
              const req = ALL_REQUIREMENTS[id];
              return (
                <span key={id} className="bg-[#1a3a6b] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {req.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* Requirement sections */}
        <div className="px-8 py-6 space-y-8">
          {selectedAssignments.map((id, assignIdx) => {
            const req = ALL_REQUIREMENTS[id];
            return (
              <div key={id}>
                {/* Assignment header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#1a3a6b] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {assignIdx + 1}
                  </div>
                  <h2 className="text-lg font-bold text-[#1a3a6b]">{req.label}</h2>
                </div>

                {/* Sections */}
                <div className="space-y-4 ml-11">
                  {req.sections.map((section, sIdx) => (
                    <div key={sIdx} className="border border-gray-200 rounded-xl overflow-hidden">
                      {/* Section title */}
                      <div className="bg-[#f0f7f3] px-4 py-2.5 border-b border-gray-200">
                        <h3 className="text-sm font-bold text-[#4a7c59] flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-[#4a7c59] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {String.fromCharCode(64 + sIdx + 1)}
                          </span>
                          {section.title}
                        </h3>
                      </div>
                      {/* Items */}
                      <div className="px-4 py-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                          {section.items.map((item, iIdx) => (
                            <div key={iIdx} className="flex items-start gap-2 py-1 border-b border-gray-50">
                              {/* Printable checkbox square */}
                              <span className="mt-0.5 flex-shrink-0 w-4 h-4 border-2 border-gray-300 rounded inline-block print-checkbox" />
                              <span className="text-sm text-gray-700 leading-snug">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {assignIdx < selectedAssignments.length - 1 && (
                  <hr className="mt-8 border-gray-200" />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-8 py-4 text-center">
          <p className="text-xs text-gray-400">
            Generated by K&A Compliance Pro &bull; {today} &bull; FY {clientInfo.financialYear} &bull; For professional use only
          </p>
        </div>
      </div>
    </div>
  );
}
