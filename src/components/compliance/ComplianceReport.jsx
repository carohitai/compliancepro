import { useState, useRef } from "react";
import Select from "react-select";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, Legend,
} from "recharts";
import {
  ASSESSMENT_YEARS, TDS_SECTIONS, CASH_LIMITS,
  TURNOVER_LIMITS, DUE_DATES, SECTOR_COMPLIANCE, KEY_AMENDMENTS,
} from "../../data/complianceData";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import WhatChangesForMe from "./WhatChangesForMe";

const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? "#1a3a6b" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(26,58,107,0.2)" : "none",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    "&:hover": { borderColor: "#1a3a6b" },
  }),
  option: (base, state) => ({
    ...base,
    fontSize: "0.8rem",
    backgroundColor: state.isSelected ? "#1a3a6b" : state.isFocused ? "#eff6ff" : "white",
  }),
  menu: (base) => ({ ...base, zIndex: 50, borderRadius: "0.75rem", overflow: "hidden" }),
};

const TABS = [
  { id: "compliance", label: "Compliance",         icon: "✅" },
  { id: "due_dates",  label: "Due Dates",           icon: "📅" },
  { id: "limits",     label: "Limits",              icon: "📊" },
  { id: "matters",    label: "What Matters",        icon: "🔔" },
  { id: "new_act",    label: "What Changes For Me", icon: "🆕" },
];

const COLORS = ["#1a3a6b", "#4a7c59", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"];

const impactColor = { High: "bg-red-100 text-red-700", Medium: "bg-yellow-100 text-yellow-700", Low: "bg-green-100 text-green-700" };

// Map BAC sector group to sector compliance key
function getSectorKey(sectorOption) {
  if (!sectorOption) return "services";
  const label = (sectorOption.group || "").toLowerCase();
  if (label.includes("manufactur")) return "manufacturing";
  if (label.includes("trade") || label.includes("wholesale") || label.includes("retail")) return "trading";
  if (label.includes("construction") || label.includes("real estate")) return "construction";
  if (label.includes("information") || label.includes("it") || label.includes("software")) return "it_software";
  if (label.includes("financial") || label.includes("insurance")) return "financial";
  if (label.includes("healthcare") || label.includes("health")) return "healthcare";
  if (label.includes("education")) return "education";
  if (label.includes("hospitality") || label.includes("hotel")) return "hospitality";
  return "services";
}

export default function ComplianceReport({ clientInfo, onBack, onReset }) {
  const [ay, setAy] = useState(null);
  const [activeTab, setActiveTab] = useState("compliance");
  const [generated, setGenerated] = useState(false);
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef(null);

  const sectorKey = getSectorKey(clientInfo.sector);
  const sectorData = SECTOR_COMPLIANCE[sectorKey] || SECTOR_COMPLIANCE.services;
  const dueDates = DUE_DATES[ay?.value] || DUE_DATES["2025-26"];

  const tdsChartData = TDS_SECTIONS.slice(0, 12).map((s) => ({
    name: `§${s.section}`,
    rate: parseFloat(s.rate) || 0,
    desc: s.description,
  }));

  const cashChartData = CASH_LIMITS.map((c) => ({
    name: `§${c.section}`,
    limit: parseFloat(c.limit.replace(/[^0-9.]/g, "")) || 0,
    desc: c.description,
  }));

  const impactCounts = KEY_AMENDMENTS.reduce((acc, a) => {
    acc[a.impact] = (acc[a.impact] || 0) + 1;
    return acc;
  }, {});
  const impactPieData = Object.entries(impactCounts).map(([k, v]) => ({ name: k, value: v }));

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
      let y = 10;
      let remaining = imgH;
      while (remaining > 0) {
        const sliceH = Math.min(remaining, pageH - 20);
        pdf.addImage(imgData, "PNG", 10, y, imgW, imgH);
        remaining -= sliceH;
        if (remaining > 0) { pdf.addPage(); y = 10; }
      }
      const safeName = clientInfo.name.replace(/[^a-z0-9]/gi, "_");
      pdf.save(`${safeName}_Compliance_Report_${ay?.value || "AY2025-26"}.pdf`);
    } finally {
      setExporting(false);
    }
  }

  if (!generated) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-bold text-gray-800 mb-4">Select Assessment Year</h3>
          <div className="max-w-sm">
            <Select
              options={ASSESSMENT_YEARS}
              value={ay}
              onChange={setAy}
              placeholder="Choose Assessment Year..."
              styles={selectStyles}
              isSearchable
            />
          </div>
          <div className="mt-3 p-3 bg-blue-50 rounded-xl text-xs text-blue-700">
            Compliance data, due dates and limits will be shown for the selected assessment year.
          </div>
        </div>
        <div className="flex justify-between">
          <button onClick={onBack} className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <button
            disabled={!ay}
            onClick={() => setGenerated(true)}
            className="bg-[#1a3a6b] hover:bg-[#152f59] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-xl shadow-sm flex items-center gap-2"
          >
            Generate Compliance Report
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <button onClick={() => setGenerated(false)} className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Change AY
        </button>
        <div className="flex gap-2 items-center">
          <button onClick={onReset} className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold px-5 py-2.5 rounded-xl text-sm">New Client</button>
          {clientInfo?.whatsapp && (
            <a
              href={`https://wa.me/91${clientInfo.whatsapp}?text=${encodeURIComponent(`Hello ${clientInfo.name}, your Compliance Report from Kolte & Associates LLP is ready. Please contact us at kolteassociates@gmail.com for your copy.`)}`}
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
            className="bg-[#1a3a6b] hover:bg-[#152f59] text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm flex items-center gap-2 text-sm disabled:opacity-60"
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

      {/* Report */}
      <div ref={reportRef} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-[#1a3a6b] text-white px-8 py-6">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">Compliance Report</p>
              <h1 className="text-2xl font-bold">{clientInfo.name}</h1>
              <p className="text-blue-200 mt-0.5 text-sm">{clientInfo.sector?.label}</p>
            </div>
            <div className="text-right text-sm text-blue-200">
              <p className="font-bold text-white text-base">{ay?.label}</p>
              <p className="mt-0.5">{clientInfo.nature?.label}</p>
              <p className="text-xs mt-1">Generated by K&amp;A Compliance Pro</p>
            </div>
          </div>
        </div>

        {/* Sector highlight ribbon */}
        <div className="bg-[#f0f7f3] border-b border-green-100 px-8 py-3 flex flex-wrap gap-5 text-sm">
          <div><span className="text-gray-500">Sector: </span><span className="font-semibold text-[#1a3a6b]">{sectorData.label}</span></div>
          <div><span className="text-gray-500">GST Rate: </span><span className="font-semibold text-gray-800">{sectorData.gstRate}</span></div>
          <div><span className="text-gray-500">Audit Trigger: </span><span className="font-semibold text-gray-800">{sectorData.auditTrigger}</span></div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-8 no-print">
          <div className="flex gap-1 -mb-px overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors
                  ${activeTab === tab.id
                    ? "border-[#1a3a6b] text-[#1a3a6b]"
                    : "border-transparent text-gray-500 hover:text-gray-700"}`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-8 py-6">
          {/* ── COMPLIANCE TAB ───────────────────────────────────────────────── */}
          {activeTab === "compliance" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Key Compliance Points – {sectorData.label}</h3>
                <div className="space-y-2">
                  {sectorData.keyChanges.map((pt, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <span className="w-5 h-5 rounded-full bg-[#1a3a6b] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                      <p className="text-sm text-gray-700">{pt}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key TDS sections for this sector */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">TDS Sections Applicable to Your Sector</h3>
                <div className="flex flex-wrap gap-2">
                  {sectorData.tdsHighlight.map((t) => (
                    <span key={t} className="bg-[#1a3a6b] text-white text-xs font-semibold px-3 py-1.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>

              {/* Amendments summary chart */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Key Amendments by Impact Level ({ay?.label})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie data={impactPieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={11}>
                          {impactPieData.map((_, i) => (
                            <Cell key={i} fill={["#ef4444", "#f59e0b", "#4a7c59"][i] || COLORS[i]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend fontSize={11} />
                      </PieChart>
                    </ResponsiveContainer>
                    <p className="text-xs text-center text-gray-500 mt-1">Amendments by impact level</p>
                  </div>
                  <div className="space-y-2">
                    {KEY_AMENDMENTS.slice(0, 5).map((a, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-lg border border-gray-100">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${impactColor[a.impact]}`}>{a.impact}</span>
                        <p className="text-xs text-gray-700 leading-snug">{a.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── DUE DATES TAB ────────────────────────────────────────────────── */}
          {activeTab === "due_dates" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Key Due Dates – {ay?.label}</h3>
              {["Income Tax", "GST", "TDS", "ROC"].map((cat) => {
                const dates = dueDates.filter((d) => d.category === cat);
                if (!dates.length) return null;
                const catColor = { "Income Tax": "#1a3a6b", GST: "#4a7c59", TDS: "#f59e0b", ROC: "#8b5cf6" }[cat];
                return (
                  <div key={cat} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-2.5 text-white text-sm font-bold" style={{ backgroundColor: catColor }}>{cat}</div>
                    <div className="divide-y divide-gray-100">
                      {dates.map((d, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                          <span className="text-xs font-mono font-bold text-gray-500 w-32 flex-shrink-0">{d.date}</span>
                          <span className="text-sm text-gray-700">{d.event}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── LIMITS TAB ───────────────────────────────────────────────────── */}
          {activeTab === "limits" && (
            <div className="space-y-6">
              {/* TDS chart */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">TDS Rate by Section (%)</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={tdsChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} unit="%" />
                      <Tooltip formatter={(v, n, p) => [`${v}%`, p.payload.desc]} />
                      <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                        {tdsChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* TDS table */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">TDS Limits – All Sections</h3>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-[#1a3a6b] text-white">
                        {["Section", "Description", "Rate", "Threshold", "Applicability"].map((h) => (
                          <th key={h} className="px-3 py-2.5 text-left font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TDS_SECTIONS.map((s, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-3 py-2 font-mono font-bold text-[#1a3a6b]">{s.section}</td>
                          <td className="px-3 py-2">{s.description}</td>
                          <td className="px-3 py-2 font-semibold text-[#4a7c59]">{s.rate}</td>
                          <td className="px-3 py-2">{s.threshold}</td>
                          <td className="px-3 py-2 text-gray-500">{s.applicability}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cash limits */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Cash Transaction Limits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CASH_LIMITS.map((c, i) => (
                    <div key={i} className="border border-red-100 bg-red-50 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono font-bold text-[#1a3a6b]">§{c.section}</span>
                        <span className="text-sm font-bold text-red-700">{c.limit}</span>
                      </div>
                      <p className="text-xs text-gray-700 mb-1">{c.description}</p>
                      <p className="text-xs text-red-600 font-medium">⚠ {c.consequence}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Turnover limits */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Turnover Thresholds</h3>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-[#4a7c59] text-white">
                        {["Threshold", "Provision", "Description", "Regime"].map((h) => (
                          <th key={h} className="px-3 py-2.5 text-left font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TURNOVER_LIMITS.map((t, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-3 py-2 font-bold text-[#4a7c59] whitespace-nowrap">{t.threshold}</td>
                          <td className="px-3 py-2 font-semibold">{t.provision}</td>
                          <td className="px-3 py-2 text-gray-600">{t.description}</td>
                          <td className="px-3 py-2"><span className="bg-[#1a3a6b] text-white text-xs px-2 py-0.5 rounded-full">{t.regime}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── WHAT MATTERS TAB ─────────────────────────────────────────────── */}
          {activeTab === "matters" && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">All Key Amendments – {ay?.label}</h3>
              {["Income Tax", "GST", "TDS"].map((cat) => {
                const items = KEY_AMENDMENTS.filter((a) => a.category === cat);
                if (!items.length) return null;
                return (
                  <div key={cat}>
                    <h4 className="text-sm font-bold text-[#1a3a6b] mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#1a3a6b] inline-block" />{cat}
                    </h4>
                    <div className="space-y-3">
                      {items.map((a, i) => (
                        <div key={i} className="border border-gray-200 rounded-xl p-4">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h5 className="font-bold text-sm text-gray-800">{a.title}</h5>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${impactColor[a.impact]}`}>{a.impact} Impact</span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{a.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {/* Source note */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-500">
                <p className="font-semibold mb-1">Knowledge Base Sources</p>
                <p>Data compiled from: incometaxindia.gov.in · gst.gov.in · taxmann.in — FY 2024-25 / {ay?.label}. For the latest updates, always refer to official circulars and notifications.</p>
              </div>
            </div>
          )}

          {/* ── NEW ACT TAB ──────────────────────────────────────────────────── */}
          {activeTab === "new_act" && (
            <WhatChangesForMe clientInfo={clientInfo} />
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-8 py-4 text-center">
          <p className="text-xs text-gray-400">K&amp;A Compliance Pro · {clientInfo.name} · {ay?.label} · Generated {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>
        </div>
      </div>
    </div>
  );
}
