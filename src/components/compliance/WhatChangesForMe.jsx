import {
  NOMENCLATURE_CHANGES,
  OPERATIONAL_CHANGES,
  RATE_CHANGES,
  WHAT_STAYS_SAME,
  getBusinessHighlights,
} from "../../data/newTaxAct";
import { useState } from "react";

const INNER_TABS = [
  { id: "nomenclature", label: "Change in Nomenclature", icon: "🔤" },
  { id: "operations",   label: "Changes in Operations",  icon: "⚙️" },
  { id: "rates",        label: "Change in Rates",        icon: "📊" },
  { id: "unchanged",    label: "What Does Not Change",   icon: "🔒" },
];

const impactColor = {
  High:   "bg-red-100 text-red-700 border border-red-200",
  Medium: "bg-amber-100 text-amber-700 border border-amber-200",
  Low:    "bg-green-100 text-green-700 border border-green-200",
};

export default function WhatChangesForMe({ clientInfo }) {
  const [activeTab, setActiveTab] = useState("nomenclature");

  const natureValue = clientInfo?.nature?.value || "default";
  const highlights = getBusinessHighlights(natureValue);

  // Pick relevant operational changes
  const operationalAll = OPERATIONAL_CHANGES.all;
  const operationalBusiness = [
    ...(OPERATIONAL_CHANGES.business || []),
    ...(OPERATIONAL_CHANGES.professional || []),
    ...(OPERATIONAL_CHANGES.salaried || []),
    ...(OPERATIONAL_CHANGES.capital_gains || []),
  ].filter(Boolean);

  return (
    <div>
      {/* K&A Branded Header */}
      <div className="bg-gradient-to-r from-[#1a3a6b] to-[#2a5298] rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="flex gap-1 mb-1">
                {["K", "&", "A"].map((ch, i) => (
                  <div key={i} className="w-9 h-10 bg-[#8ab45a] flex items-center justify-center rounded-sm shadow-sm">
                    <span className="text-[#1a3a6b] font-serif font-bold text-base">{ch}</span>
                  </div>
                ))}
              </div>
              <p className="text-[#8ab45a] text-xs font-semibold text-center tracking-wide">KOLTE & ASSOCIATES</p>
            </div>
            <div>
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest">Special Report</p>
              <h2 className="text-2xl font-bold mt-0.5">What Changes For Me?</h2>
              <p className="text-blue-200 text-sm mt-1">
                New Income Tax Act 2025 — Effective from <strong className="text-white">Tax Year 2026-27</strong>
              </p>
            </div>
          </div>
          <div className="text-right text-sm text-blue-200">
            <p className="font-bold text-white text-base">{clientInfo?.name}</p>
            <p>{clientInfo?.nature?.label}</p>
            <p className="text-xs mt-1">Income Tax Bill, 2025 (Introduced 13 Feb 2025)</p>
          </div>
        </div>

        {/* Business-specific top priorities */}
        {highlights.topChanges.length > 0 && (
          <div className="mt-5 bg-white/10 rounded-xl p-4 border border-white/20">
            <p className="text-xs font-bold uppercase tracking-widest text-[#8ab45a] mb-2">
              🎯 Top Priorities for Your Business ({clientInfo?.nature?.label})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {highlights.topChanges.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-white">
                  <span className="text-[#8ab45a] font-bold flex-shrink-0">→</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inner tab navigation */}
      <div className="flex flex-wrap gap-2 mb-5">
        {INNER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all border
              ${activeTab === tab.id
                ? "bg-[#1a3a6b] text-white border-[#1a3a6b] shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#1a3a6b] hover:text-[#1a3a6b]"}`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ── NOMENCLATURE ──────────────────────────────────────────────────────── */}
      {activeTab === "nomenclature" && (
        <div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-800">
            <strong>What this means:</strong> The new Income Tax Act replaces legal jargon with plain language.
            All forms, notices and correspondence from the Income Tax Department will use new terminology from TY 2026-27 onwards.
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a3a6b] text-white">
                  <th className="px-4 py-3 text-left font-semibold w-1/3">Old Term (IT Act 1961)</th>
                  <th className="px-4 py-3 text-left font-semibold w-1/3">New Term (IT Act 2025)</th>
                  <th className="px-4 py-3 text-left font-semibold">What It Means for You</th>
                </tr>
              </thead>
              <tbody>
                {NOMENCLATURE_CHANGES.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 font-semibold text-red-700 line-through decoration-red-300">{item.old}</td>
                    <td className="px-4 py-3 font-bold text-[#4a7c59]">{item.newTerm}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs leading-relaxed">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── OPERATIONS ────────────────────────────────────────────────────────── */}
      {activeTab === "operations" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#1a3a6b] uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1a3a6b] inline-block" /> Applies to All Taxpayers
            </h3>
            <div className="space-y-3">
              {operationalAll.map((item, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4 flex items-start gap-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 mt-0.5 ${impactColor[item.impact]}`}>{item.impact}</span>
                  <div>
                    <p className="font-bold text-sm text-gray-800 mb-1">{item.title}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#4a7c59] uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4a7c59] inline-block" /> Business &amp; Professional Specific
            </h3>
            <div className="space-y-3">
              {operationalBusiness.map((item, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4 flex items-start gap-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 mt-0.5 ${impactColor[item.impact]}`}>{item.impact}</span>
                  <div>
                    <p className="font-bold text-sm text-gray-800 mb-1">{item.title}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── RATES ─────────────────────────────────────────────────────────────── */}
      {activeTab === "rates" && (
        <div className="space-y-5">
          {RATE_CHANGES.map((cat, ci) => (
            <div key={ci} className={`border rounded-xl overflow-hidden ${cat.changed ? "border-amber-300" : "border-gray-200"}`}>
              <div className={`px-4 py-3 flex items-center justify-between ${cat.changed ? "bg-amber-50" : "bg-gray-50"}`}>
                <h3 className="font-bold text-sm text-gray-800">{cat.category}</h3>
                {cat.changed && <span className="text-xs bg-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded-full">Changed ⚠</span>}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#1a3a6b] text-white">
                      <th className="px-4 py-2 text-left font-semibold">Income Range / Category</th>
                      <th className="px-4 py-2 text-left font-semibold">Tax Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.slabs.map((s, si) => (
                      <tr key={si} className={si % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-2.5">{s.income}</td>
                        <td className={`px-4 py-2.5 font-bold ${s.rate.includes("was") ? "text-amber-700" : "text-[#4a7c59]"}`}>{s.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {cat.note && (
                <div className="px-4 py-2.5 bg-blue-50 border-t border-blue-100 text-xs text-blue-700">
                  ℹ {cat.note}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── WHAT STAYS SAME ───────────────────────────────────────────────────── */}
      {activeTab === "unchanged" && (
        <div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-sm text-green-800">
            <strong>Good news:</strong> Despite all the changes in language and structure, the core compliance obligations remain the same.
            Your existing compliance processes need minimal changes.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {WHAT_STAYS_SAME.map((item, i) => (
              <div key={i} className="border border-green-200 bg-green-50 rounded-xl p-4 flex items-start gap-3">
                <span className="text-green-500 text-lg flex-shrink-0">✓</span>
                <div>
                  <p className="font-bold text-sm text-gray-800 mb-1">{item.point}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer note */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-500">
        <p className="font-semibold mb-1">Kolte &amp; Associates LLP, Chartered Accountants</p>
        <p>This report is based on the Income Tax Bill, 2025 as introduced in Parliament on 13 February 2025.
        The Bill is subject to amendments and final enactment. For the latest updates refer to incometaxindia.gov.in.
        This is for informational purposes only and does not constitute professional advice.</p>
      </div>
    </div>
  );
}
