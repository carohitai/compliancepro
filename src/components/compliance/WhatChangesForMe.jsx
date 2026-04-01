import {
  NOMENCLATURE_CHANGES,
  OPERATIONAL_CHANGES,
  RATE_CHANGES,
  WHAT_STAYS_SAME,
  getBusinessHighlights,
} from "../../data/newTaxAct";
import { useState } from "react";

// ── WhatsApp message generator ─────────────────────────────────────────────
function buildWhatsAppMessage(clientInfo, highlights) {
  const name = clientInfo?.name || "Taxpayer";
  const nature = clientInfo?.nature?.label || "Business";

  const topLines = highlights.topChanges.slice(0, 4).map((c) => `  → ${c}`).join("\n");

  const highOpsAll = OPERATIONAL_CHANGES.all
    .filter((o) => o.impact === "High")
    .map((o) => `  • ${o.title}`)
    .join("\n");

  const nomenclatureLines = NOMENCLATURE_CHANGES.slice(0, 6)
    .map((n) => `  • ${n.old} → *${n.newTerm}*`)
    .join("\n");

  const staysSame = WHAT_STAYS_SAME.slice(0, 4)
    .map((s) => `  ✓ ${s.point}`)
    .join("\n");

  return `🆕 *New Income Tax Act 2025 — What Changes For Me?*
_Prepared by Kolte & Associates LLP, Chartered Accountants_

👤 *Name:* ${name}
🏢 *Business:* ${nature}

━━━━━━━━━━━━━━━━━━━━
🎯 *YOUR TOP PRIORITIES*
${topLines || "  → Review faceless proceedings & pre-filled returns"}

━━━━━━━━━━━━━━━━━━━━
📝 *KEY NOMENCLATURE CHANGES*
${nomenclatureLines}
  _(…and ${NOMENCLATURE_CHANGES.length - 6} more)_

━━━━━━━━━━━━━━━━━━━━
⚙️ *HIGH IMPACT OPERATIONAL CHANGES*
${highOpsAll}

━━━━━━━━━━━━━━━━━━━━
📊 *RATE HIGHLIGHTS*
  • New Regime: up to ₹7L → Nil (87A rebate)
  • LTCG (listed equity): 12.5% _(was 10%)_
  • STCG (listed equity): 20% _(was 15%)_
  • LTCG exemption: ₹1.25 lakh p.a.

━━━━━━━━━━━━━━━━━━━━
✅ *WHAT DOES NOT CHANGE*
${staysSame}

━━━━━━━━━━━━━━━━━━━━
_Effective from Tax Year 2026-27_
_Income Tax Bill, 2025 (introduced 13 Feb 2025)_

🌐 Full interactive report:
https://carohitai.github.io/compliancepro/

_This message is for informational purposes only and does not constitute professional advice. For personalised guidance contact Kolte & Associates LLP._`;
}

// Nextel WhatsApp API endpoint
const NEXTEL_URL = "https://api.nextel.io/WEBHOOK_V1/Audience/set/39027dfad5138c9ca0c474d71db915c3";

async function sendViaNextel(phone, message) {
  const res = await fetch(NEXTEL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: `91${phone}`, message }),
  });
  if (!res.ok) throw new Error(`Nextel API error: ${res.status}`);
  return res;
}

function SendWhatsAppButton({ clientInfo, highlights }) {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error | fallback

  async function handleSend() {
    const phone = clientInfo?.whatsapp;
    const message = buildWhatsAppMessage(clientInfo, highlights);

    if (phone) {
      setStatus("sending");
      try {
        await sendViaNextel(phone, message);
        setStatus("sent");
        setTimeout(() => setStatus("idle"), 5000);
      } catch {
        // API failed — fall back to wa.me
        setStatus("fallback");
        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/91${phone}?text=${encoded}`, "_blank", "noopener,noreferrer");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } else {
      // No number — open wa.me so user can choose recipient
      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/?text=${encoded}`, "_blank", "noopener,noreferrer");
      setStatus("sent");
      setTimeout(() => setStatus("idle"), 4000);
    }
  }

  const sent = status === "sent";
  const sending = status === "sending";
  const fallback = status === "fallback";

  return (
    <button
      onClick={handleSend}
      disabled={sending}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm
        ${sent || fallback
          ? "bg-green-600 text-white cursor-default"
          : sending
          ? "bg-green-400 text-white cursor-wait"
          : "bg-[#25D366] hover:bg-[#1ebe57] text-white hover:shadow-md"}`}
    >
      {sending ? (
        <>⏳ Sending…</>
      ) : sent ? (
        <>✓ {clientInfo?.whatsapp ? "Message Sent!" : "Opening WhatsApp…"}</>
      ) : fallback ? (
        <>✓ Opened WhatsApp</>
      ) : (
        <>
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {clientInfo?.whatsapp ? `Send to +91 ${clientInfo.whatsapp}` : "Share on WhatsApp"}
        </>
      )}
    </button>
  );
}

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
  const phone = clientInfo?.whatsapp;

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
            {phone && <p className="text-xs mt-0.5 text-green-300">📱 +91 {phone}</p>}
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

      {/* Inner tab navigation + WhatsApp button */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 no-print">
        <div className="flex flex-wrap gap-2">
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
        <SendWhatsAppButton clientInfo={clientInfo} highlights={highlights} />
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

      {/* Footer */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        {/* WhatsApp CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-gray-200 no-print">
          <div>
            <p className="text-sm font-semibold text-gray-700">Share this report on WhatsApp</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {clientInfo?.whatsapp
                ? `Will be sent to +91 ${clientInfo.whatsapp}`
                : "Opens WhatsApp with the full report pre-filled"}
            </p>
          </div>
          <SendWhatsAppButton clientInfo={clientInfo} highlights={highlights} />
        </div>
        <p className="text-xs font-semibold text-gray-600 mb-1">Kolte &amp; Associates LLP, Chartered Accountants</p>
        <p className="text-xs text-gray-500">
          This report is based on the Income Tax Bill, 2025 as introduced in Parliament on 13 February 2025.
          The Bill is subject to amendments and final enactment. For the latest updates refer to incometaxindia.gov.in.
          This is for informational purposes only and does not constitute professional advice.
        </p>
      </div>
    </div>
  );
}
