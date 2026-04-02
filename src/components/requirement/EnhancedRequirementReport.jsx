import { useRef, useState } from "react";
import { ALL_REQUIREMENTS, LOAN_SPECIFIC_SECTIONS, getKycSection } from "../../data/requirements";
import { BANK_RATES, LOAN_DISCLAIMER } from "../../data/bankRates";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const purposeToAssignment = {
  accounting: "accounting",
  gst_returns: "gst",
  tax_audit: "it_audit",
  itr: "itr",
  tds: "tds",
  gst_audit: "gst_audit",
  loan: "project_finance",
};

export default function EnhancedRequirementReport({ clientInfo, purpose, loanType, files, onBack, onReset }) {
  const reportRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  const assignmentKey = purposeToAssignment[purpose.value];
  const req = ALL_REQUIREMENTS[assignmentKey];
  const isLoan = purpose.value === "loan";
  const constitution = clientInfo?.constitution?.label || clientInfo?.constitution || null;

  // Build dynamic sections for loan: constitution-aware KYC + loan-type-specific docs
  const loanSections = isLoan ? (() => {
    const base = req ? req.sections.filter(s => s.title !== "KYC & Entity Documents") : [];
    const kycSection = getKycSection(constitution);
    const loanSpecific = loanType ? LOAN_SPECIFIC_SECTIONS[loanType.value] : null;
    return [kycSection, ...base, ...(loanSpecific ? [loanSpecific] : [])];
  })() : null;

  const displaySections = isLoan ? loanSections : req?.sections;

  async function exportPDF() {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 1.5, useCORS: true, logging: false });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW - 20;
      const imgH = (canvas.height * imgW) / canvas.width;
      const maxH = pageH - 20;
      let imgY = 0;
      let firstPage = true;
      while (imgY < imgH) {
        if (!firstPage) pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, 10 - imgY, imgW, imgH);
        imgY += maxH;
        firstPage = false;
      }
      const safeName = clientInfo.name.replace(/[^a-z0-9]/gi, "_");
      pdf.save(`${safeName}_Requirements_${purpose.label.replace(/[^a-z0-9]/gi, "_")}.pdf`);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <button onClick={onBack} className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Edit
        </button>
        <div className="flex gap-2">
          <button onClick={onReset} className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold px-5 py-2.5 rounded-xl text-sm">New Client</button>
          {clientInfo?.whatsapp && (
            <a
              href={`https://wa.me/91${clientInfo.whatsapp}?text=${encodeURIComponent(`Hello ${clientInfo.name}, your Requirement Report (${purpose.label}) from Kolte & Associates LLP is ready. Please contact us at kolteassociates@gmail.com for your copy.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 text-sm"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Send on WhatsApp
            </a>
          )}
          <button
            onClick={exportPDF}
            disabled={exporting}
            className="bg-[#4a7c59] hover:bg-[#3d6b4a] text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm flex items-center gap-2 text-sm disabled:opacity-60"
          >
            {exporting ? "Exporting…" : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      <div ref={reportRef} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-[#4a7c59] text-white px-8 py-6">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="text-green-200 text-xs font-semibold uppercase tracking-widest mb-1">Requirement Report</p>
              <h1 className="text-2xl font-bold">{clientInfo.name}</h1>
              <p className="text-green-200 mt-0.5 text-sm">{clientInfo.sector?.label} · {clientInfo.nature?.label}</p>
            </div>
            <div className="text-right text-sm text-green-200">
              <p className="font-bold text-white">{purpose.label}</p>
              {isLoan && loanType && <p className="mt-0.5">{loanType.label}</p>}
              <p className="text-xs mt-1">{today}</p>
            </div>
          </div>
        </div>

        {/* Contact ribbon */}
        <div className="bg-[#f0f7f3] border-b border-green-100 px-8 py-3 flex flex-wrap gap-5 text-sm">
          <div><span className="text-gray-500">Email: </span><span className="font-semibold">{clientInfo.email}</span></div>
          <div><span className="text-gray-500">WhatsApp: </span><span className="font-semibold">{clientInfo.whatsapp}</span></div>
          {files.length > 0 && (
            <div><span className="text-gray-500">Documents uploaded: </span><span className="font-semibold">{files.map((f) => f.name).join(", ")}</span></div>
          )}
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Requirement checklist */}
          {displaySections && (
            <div>
              <h2 className="text-lg font-bold text-[#4a7c59] mb-4">
                {isLoan ? `${loanType?.label || "Loan"} — Document Checklist` : `${req.label} — Document Checklist`}
                {constitution && isLoan && (
                  <span className="ml-2 text-sm font-normal text-gray-500">({constitution})</span>
                )}
              </h2>
              <div className="space-y-4">
                {displaySections.map((section, sIdx) => (
                  <div key={sIdx} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-[#f0f7f3] px-4 py-2.5 border-b border-gray-200">
                      <h3 className="text-sm font-bold text-[#4a7c59] flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-[#4a7c59] text-white text-xs font-bold flex items-center justify-center">
                          {String.fromCharCode(64 + sIdx + 1)}
                        </span>
                        {section.title}
                      </h3>
                    </div>
                    <div className="px-4 py-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                        {section.items.map((item, iIdx) => (
                          <div key={iIdx} className="flex items-start gap-2 py-1 border-b border-gray-50">
                            <span className="mt-0.5 flex-shrink-0 w-4 h-4 border-2 border-gray-300 rounded inline-block" />
                            <span className="text-sm text-gray-700 leading-snug">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── LOAN SECTION ─────────────────────────────────────────────────── */}
          {isLoan && loanType && (
            <div className="mt-6">
              <h2 className="text-lg font-bold text-[#1a3a6b] mb-2">
                Indicative Interest Rates — {loanType.label}
              </h2>
              <p className="text-xs text-gray-500 mb-4">Rates as per publicly available information. Subject to change. See disclaimer below.</p>

              {/* Rates grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {BANK_RATES.map((bank) => {
                  const rate = bank.rates[loanType.value];
                  if (!rate) return null;
                  const typeColor = bank.type === "Public Sector" ? "#1a3a6b" : bank.type === "Private Bank" ? "#4a7c59" : "#f59e0b";
                  return (
                    <div key={bank.lender} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-bold text-sm text-gray-800 leading-tight">{bank.lender}</p>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white mt-1 inline-block" style={{ backgroundColor: typeColor }}>
                            {bank.type}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold" style={{ color: typeColor }}>{rate.min}%</p>
                          <p className="text-xs text-gray-400">to {rate.max}%</p>
                        </div>
                      </div>
                      {rate.note && <p className="text-xs text-gray-500 mt-1">{rate.note}</p>}
                    </div>
                  );
                })}
              </div>

              {/* Rate comparison summary bar chart hints */}
              <div className="overflow-x-auto rounded-xl border border-gray-200 mb-4">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#1a3a6b] text-white">
                      <th className="px-3 py-2.5 text-left">Lender</th>
                      <th className="px-3 py-2.5 text-left">Type</th>
                      <th className="px-3 py-2.5 text-center">Min Rate</th>
                      <th className="px-3 py-2.5 text-center">Max Rate</th>
                      <th className="px-3 py-2.5 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BANK_RATES.map((bank, i) => {
                      const rate = bank.rates[loanType.value];
                      if (!rate) return null;
                      return (
                        <tr key={bank.lender} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-3 py-2 font-semibold">{bank.lender}</td>
                          <td className="px-3 py-2 text-gray-500">{bank.type}</td>
                          <td className="px-3 py-2 text-center font-bold text-[#4a7c59]">{rate.min}%</td>
                          <td className="px-3 py-2 text-center font-bold text-red-500">{rate.max}%</td>
                          <td className="px-3 py-2 text-gray-400">{rate.note || "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-bold text-amber-800 mb-1 flex items-center gap-1">⚠ Professional Disclaimer</p>
                <p className="text-xs text-amber-700 leading-relaxed">{LOAN_DISCLAIMER}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-8 py-4 text-center">
          <p className="text-xs text-gray-400">K&amp;A Compliance Pro · {clientInfo.name} · {purpose.label} · {today}</p>
        </div>
      </div>
    </div>
  );
}
