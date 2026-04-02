import {
  NOMENCLATURE_CHANGES,
  OPERATIONAL_CHANGES,
  RATE_CHANGES,
  WHAT_STAYS_SAME,
  CONSTITUTION_OPTIONS,
  CONSTITUTION_TO_OP_CATEGORIES,
  OP_CATEGORY_LABELS,
  getBusinessHighlights,
  getTdsSectionsByIndustry,
} from "../../data/newTaxAct";
import { useState } from "react";
import SearchableSelect from "../SearchableSelect";
import WhatChangesPdfTemplate from "../whatchanges/WhatChangesPdfTemplate";
import { generateWhatChangesPdf, buildPdfBlob } from "../../lib/generateWhatChangesPdf";
import { uploadPdfBlob } from "../../lib/uploadPdf";
import { generateShareableReportUrl } from "../../lib/generateShareableUrl";

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

// Nextel WhatsApp Business API — send_template endpoint (API_V2)
const NEXTEL_SEND_URL = "https://api.nextel.io/API_V2/Whatsapp/send_template/ZlVhbG5hS3J3SElqMnllNUJsUllGZz09";
// corsproxy.io forwards the request server-side — bypasses browser CORS restriction
const CORS_PROXY = "https://corsproxy.io/?url=";

/**
 * Dispatches the Nextel send_template call.
 * Tries CORS proxy first (most reliable), then direct, then no-cors last resort.
 */
// K&A's WhatsApp Business number registered with Nextel
const KA_SENDER_PHONE = "919049444995";

async function dispatchNextel(phone, clientInfo, docUrl) {
  const payload = {
    type: "buttonTemplate",
    templateId: "attached_document",
    templateLanguage: "en",
    sender_phone: KA_SENDER_PHONE,  // K&A's Nextel-registered WA Business number
    phone: `91${phone}`,            // recipient's number
    templateArgs: [
      docUrl,
      clientInfo?.name || "Taxpayer",
      `New Income Tax Act 2025 report for ${clientInfo?.nature?.label || "your business"}. Prepared by Kolte & Associates LLP, Chartered Accountants.`,
    ],
  };

  const body = JSON.stringify(payload);
  const jsonHeaders = { "Content-Type": "application/json" };

  // ── Try 1: via corsproxy.io (fixed url= param format) ───────────────────
  try {
    const res = await fetch(CORS_PROXY + encodeURIComponent(NEXTEL_SEND_URL), {
      method: "POST",
      headers: jsonHeaders,
      body,
    });
    if (res.ok) return;
    throw new Error(`proxy1 HTTP ${res.status}`);
  } catch { /* try backup proxy */ }

  // ── Try 2: allorigins.win as backup CORS proxy ───────────────────────────
  try {
    const res = await fetch(
      `https://api.allorigins.win/raw?url=${encodeURIComponent(NEXTEL_SEND_URL)}`,
      { method: "POST", headers: jsonHeaders, body }
    );
    if (res.ok) return;
    throw new Error(`proxy2 HTTP ${res.status}`);
  } catch { /* try direct last */ }

  // ── Try 3: direct call (works if Nextel adds CORS headers in future) ─────
  const res = await fetch(NEXTEL_SEND_URL, {
    method: "POST",
    headers: jsonHeaders,
    body,
  });
  if (!res.ok) throw new Error(`direct HTTP ${res.status}`);
}

/**
 * Full Phase 2 flow:
 *   1. Generate PDF blob in memory
 *   2. Upload via CORS proxy → get real PDF URL
 *   3. Falls back to personalised shareable report URL if upload fails
 *   4. Sends via Nextel (also via CORS proxy)
 */
async function sendViaNextel(phone, clientInfo, onProgress) {
  // Personalised shareable URL — much better than homepage as fallback
  let docUrl = generateShareableReportUrl(clientInfo);

  try {
    onProgress("generating");
    const { blob, filename } = await buildPdfBlob(clientInfo?.name);

    onProgress("uploading");
    const uploaded = await uploadPdfBlob(blob, filename);
    if (uploaded) docUrl = uploaded;
  } catch {
    // PDF gen or upload failed — shareable URL is the fallback
  }

  onProgress("sending");
  await dispatchNextel(phone, clientInfo, docUrl);
  return docUrl;
}

// Status label map for the Phase 2 progress states
const WA_STATUS_LABEL = {
  generating: "⏳ Generating PDF…",
  uploading:  "⏳ Uploading PDF…",
  sending:    "⏳ Sending…",
  sent:       "✓ PDF Sent on WhatsApp!",
  fallback:   "✓ Opened WhatsApp",
};

function SendWhatsAppButton({ clientInfo, highlights, compact = false }) {
  // idle | generating | uploading | sending | sent | fallback
  const [status, setStatus] = useState("idle");

  async function handleSend() {
    const phone   = clientInfo?.whatsapp;
    const message = buildWhatsAppMessage(clientInfo, highlights);

    if (phone) {
      try {
        await sendViaNextel(phone, clientInfo, setStatus);
        setStatus("sent");
        setTimeout(() => setStatus("idle"), 6000);
      } catch {
        // Full failure — fall back to wa.me deep link
        setStatus("fallback");
        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/91${phone}?text=${encoded}`, "_blank", "noopener,noreferrer");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } else {
      // No number entered — open wa.me so user picks recipient themselves
      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/?text=${encoded}`, "_blank", "noopener,noreferrer");
      setStatus("sent");
      setTimeout(() => setStatus("idle"), 4000);
    }
  }

  const busy    = ["generating", "uploading", "sending"].includes(status);
  const done    = ["sent", "fallback"].includes(status);
  const label   = WA_STATUS_LABEL[status];

  const waIcon = (
    <svg viewBox="0 0 24 24" className={compact ? "w-3.5 h-3.5 fill-current" : "w-4 h-4 fill-current"} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );

  if (compact) {
    return (
      <button
        onClick={handleSend}
        disabled={busy}
        title={clientInfo?.whatsapp ? `Send PDF to +91 ${clientInfo.whatsapp}` : "Share on WhatsApp"}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-sm
          ${done
            ? "bg-green-600 text-white cursor-default"
            : busy
            ? "bg-green-400 text-white cursor-wait"
            : "bg-[#25D366] hover:bg-[#1ebe57] text-white hover:shadow-md"}`}
      >
        {busy || done ? (
          <span className="hidden sm:inline">{label || "…"}</span>
        ) : (
          <>{waIcon}<span className="hidden sm:inline">WhatsApp</span></>
        )}
        {(busy || done) && waIcon}
      </button>
    );
  }

  return (
    <button
      onClick={handleSend}
      disabled={busy}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm
        ${done
          ? "bg-green-600 text-white cursor-default"
          : busy
          ? "bg-green-400 text-white cursor-wait"
          : "bg-[#25D366] hover:bg-[#1ebe57] text-white hover:shadow-md"}`}
    >
      {busy || done ? (
        <>{label || "…"}</>
      ) : (
        <>
          {waIcon}
          {clientInfo?.whatsapp ? `Send PDF to +91 ${clientInfo.whatsapp}` : "Share on WhatsApp"}
        </>
      )}
    </button>
  );
}

const INNER_TABS = [
  { id: "nomenclature", label: "Change in Nomenclature", icon: "🔤" },
  { id: "operations",   label: "Changes in Operations",  icon: "⚙️" },
  { id: "rates",        label: "Change in Rates",        icon: "📊" },
  { id: "tds",          label: "TDS Section Numbers",    icon: "🔢" },
  { id: "unchanged",    label: "What Does Not Change",   icon: "🔒" },
];

const impactColor = {
  High:   "bg-red-100 text-red-700 border border-red-200",
  Medium: "bg-amber-100 text-amber-700 border border-amber-200",
  Low:    "bg-green-100 text-green-700 border border-green-200",
};

// ── PDF Download button ────────────────────────────────────────────────────
function DownloadPdfButton({ clientInfo }) {
  const [pdfStatus, setPdfStatus] = useState("idle"); // idle | generating | done

  async function handleDownload() {
    setPdfStatus("generating");
    try {
      await generateWhatChangesPdf(clientInfo?.name);
      setPdfStatus("done");
    } catch (e) {
      console.error("PDF error:", e);
      setPdfStatus("idle");
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={pdfStatus === "generating"}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm
        ${pdfStatus === "done"
          ? "bg-[#1a3a6b] text-white cursor-default"
          : pdfStatus === "generating"
          ? "bg-gray-300 text-gray-500 cursor-wait"
          : "bg-[#1a3a6b] hover:bg-[#0f2548] text-white hover:shadow-md"}`}
    >
      {pdfStatus === "generating" ? (
        <>⏳ Generating PDF…</>
      ) : pdfStatus === "done" ? (
        <>✓ PDF Downloaded</>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF
        </>
      )}
    </button>
  );
}

// ── Post-download success notification modal ───────────────────────────────
function PdfSuccessModal({ clientInfo, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a3a6b] to-[#2a5298] p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#8ab45a] rounded-full flex items-center justify-center text-xl">✓</div>
            <div>
              <p className="font-bold text-lg">Report Generated Successfully!</p>
              <p className="text-blue-200 text-xs">Your PDF has been downloaded</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* What the report covers */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs font-bold text-[#1a3a6b] uppercase tracking-wide mb-2">About This Report</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Your personalised <strong>New Income Tax Act 2025 — What Changes For Me?</strong> report has been prepared
              for <strong>{clientInfo?.name}</strong> ({clientInfo?.nature?.label}). It covers all key changes effective
              from Tax Year 2026-27 — including renamed terminology, new digital procedures, revised tax rates, and
              obligations that remain unchanged — helping you prepare well in advance.
            </p>
          </div>

          {/* Expert guidance CTA */}
          <div className="bg-[#1a3a6b]/5 border border-[#1a3a6b]/20 rounded-xl p-4">
            <p className="text-xs font-bold text-[#1a3a6b] uppercase tracking-wide mb-3">For Expert Guidance</p>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
              For personalised advisory, tax planning, and implementation support specific to your business, connect with our team at Kolte &amp; Associates LLP.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400 font-semibold mb-1">📧 Email</p>
                <a href="mailto:ca.rohit@Kolte.biz" className="block text-xs font-semibold text-[#1a3a6b] hover:underline">ca.rohit@Kolte.biz</a>
                <a href="mailto:ca.pawan@kolte.biz" className="block text-xs font-semibold text-[#1a3a6b] hover:underline">ca.pawan@kolte.biz</a>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold mb-1">📱 Call / WhatsApp</p>
                <a href="tel:+919764488999" className="block text-xs font-semibold text-[#1a3a6b] hover:underline">+91 9764488999</a>
                <a href="tel:+919049222233" className="block text-xs font-semibold text-[#1a3a6b] hover:underline">+91 9049222233</a>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-xs font-bold text-amber-800 mb-1">⚠ Disclaimer</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              This is a system-generated compliance dashboard report for knowledge and information purposes only.
              All facts should be cross-checked with the relevant statutory provisions and your consultant before any action.
              Responsibility for use of this information rests solely with the user.
              Kolte &amp; Associates LLP shall not be liable for any consequence arising from reliance on this report.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#1a3a6b] text-white font-bold rounded-xl text-sm hover:bg-[#0f2548] transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Constitution filter bar (shown inside each tab) ───────────────────────────
function ConstitutionFilter({ constitution, onChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4 p-3 bg-[#1a3a6b]/5 border border-[#1a3a6b]/15 rounded-xl">
      <span className="text-xs font-bold text-[#1a3a6b] uppercase tracking-wide whitespace-nowrap flex-shrink-0">
        Filter by Constitution:
      </span>
      <SearchableSelect
        options={CONSTITUTION_OPTIONS}
        value={constitution}
        onChange={onChange}
        placeholder="— All entity types —"
        className="flex-1 min-w-0"
      />
      {constitution && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-xs text-gray-400 hover:text-gray-600 whitespace-nowrap flex-shrink-0 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
}

export default function WhatChangesForMe({ clientInfo }) {
  const [activeTab, setActiveTab] = useState("nomenclature");
  const [showPdfSuccess, setShowPdfSuccess] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  // Constitution filter — initialised from the form, changeable in-report
  const [constitution, setConstitution] = useState(
    clientInfo?.constitution?.value || ""
  );

  const natureValue = clientInfo?.nature?.value || "default";
  const highlights  = getBusinessHighlights(natureValue);
  const tdsSections = getTdsSectionsByIndustry(natureValue);
  const phone = clientInfo?.whatsapp;

  // Derive which OPERATIONAL_CHANGES categories to show for the chosen constitution
  const opCategories = constitution
    ? (CONSTITUTION_TO_OP_CATEGORIES[constitution] || Object.keys(OPERATIONAL_CHANGES))
    : Object.keys(OPERATIONAL_CHANGES);

  // Filter RATE_CHANGES by chosen constitution
  const visibleRates = RATE_CHANGES.filter((r) => {
    if (!constitution) return true;
    if (!r.constitutions) return true;
    return r.constitutions.includes("all") || r.constitutions.includes(constitution);
  });

  async function handleDownloadPdf() {
    setPdfGenerating(true);
    try {
      await generateWhatChangesPdf(clientInfo?.name);
      setShowPdfSuccess(true);
    } catch (e) {
      console.error("PDF error:", e);
    } finally {
      setPdfGenerating(false);
    }
  }

  return (
    <div>
      {/* Success modal */}
      {showPdfSuccess && (
        <PdfSuccessModal clientInfo={clientInfo} onClose={() => setShowPdfSuccess(false)} />
      )}

      {/* Hidden PDF template — captured by html2canvas */}
      <div style={{
        position: "fixed", top: 0, left: "-9999px",
        opacity: 0, pointerEvents: "none", zIndex: -1,
      }}>
        <WhatChangesPdfTemplate clientInfo={clientInfo} />
      </div>

      {/* K&A Branded Header */}
      <div className="bg-gradient-to-r from-[#1a3a6b] to-[#2a5298] rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
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
          <div className="text-left sm:text-right text-sm text-blue-200">
            <p className="font-bold text-white text-base">{clientInfo?.name}</p>
            <p>{clientInfo?.nature?.label}</p>
            {clientInfo?.constitution && (
              <p className="text-xs mt-0.5 text-amber-300">🏛 {clientInfo.constitution.label}</p>
            )}
            {phone && <p className="text-xs mt-0.5 text-green-300">📱 +91 {phone}</p>}
            <p className="text-xs mt-1 opacity-70">Income Tax Bill, 2025 (13 Feb 2025)</p>
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

      {/* Sticky action strip — always visible below the header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm no-print -mx-4 px-4 pt-2.5 pb-2 mb-4">
        {/* Row 1: Tabs */}
        <div className="overflow-x-auto pb-2">
          <div className="flex justify-center gap-2 min-w-max mx-auto">
            {INNER_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border whitespace-nowrap
                  ${activeTab === tab.id
                    ? "bg-[#1a3a6b] text-white border-[#1a3a6b] shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#1a3a6b] hover:text-[#1a3a6b]"}`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
        </div>
        {/* Row 2: Action buttons — centred */}
        <div className="flex justify-center items-center gap-3">
          <button
            onClick={handleDownloadPdf}
            disabled={pdfGenerating}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-sm
              ${pdfGenerating
                ? "bg-gray-200 text-gray-400 cursor-wait"
                : "bg-[#1a3a6b] hover:bg-[#0f2548] text-white hover:shadow-md"}`}
          >
            {pdfGenerating ? <>⏳</> : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </>
            )}
          </button>
          <SendWhatsAppButton clientInfo={clientInfo} highlights={highlights} compact />
        </div>
      </div>

      {/* ── NOMENCLATURE ──────────────────────────────────────────────────────── */}
      {activeTab === "nomenclature" && (
        <div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-800">
            <strong>What this means:</strong> The new Income Tax Act replaces legal jargon with plain language.
            All forms, notices and correspondence from the Income Tax Department will use new terminology from TY 2026-27 onwards.
            {constitution && (
              <span className="ml-1 font-semibold text-[#1a3a6b]">
                — Showing all terms (rename applies to every entity type).
              </span>
            )}
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a3a6b] text-white">
                  <th className="px-3 sm:px-4 py-3 text-left font-semibold">Old Term (IT Act 1961)</th>
                  <th className="px-3 sm:px-4 py-3 text-left font-semibold">New Term (IT Act 2025)</th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left font-semibold">What It Means for You</th>
                </tr>
              </thead>
              <tbody>
                {NOMENCLATURE_CHANGES.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-3 sm:px-4 py-2.5 font-semibold text-red-700 line-through decoration-red-300 text-xs sm:text-sm">{item.old}</td>
                    <td className="px-3 sm:px-4 py-2.5 font-bold text-[#4a7c59] text-xs sm:text-sm">
                      {item.newTerm}
                      <p className="sm:hidden text-xs text-gray-500 font-normal mt-0.5 no-underline">{item.note}</p>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-2.5 text-gray-600 text-xs leading-relaxed">{item.note}</td>
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
          {opCategories.map((catKey) => {
            const items = OPERATIONAL_CHANGES[catKey];
            if (!items || items.length === 0) return null;
            return (
              <div key={catKey}>
                <h3 className="text-sm font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                  style={{ color: catKey === "all" ? "#1a3a6b" : "#4a7c59" }}>
                  <span className="w-2 h-2 rounded-full inline-block"
                    style={{ background: catKey === "all" ? "#1a3a6b" : "#4a7c59" }} />
                  {OP_CATEGORY_LABELS[catKey] || catKey}
                </h3>
                <div className="space-y-3">
                  {items.map((item, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-3 sm:p-4 flex items-start gap-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 mt-0.5 ${impactColor[item.impact]}`}>{item.impact}</span>
                      <div>
                        <p className="font-bold text-sm text-gray-800 mb-1">{item.title}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── RATES ─────────────────────────────────────────────────────────────── */}
      {activeTab === "rates" && (
        <div className="space-y-4">
          {visibleRates.map((cat, ci) => (
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

      {/* ── TDS SECTION RENUMBERING ───────────────────────────────────────────── */}
      {activeTab === "tds" && (
        <div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-sm text-blue-800">
            <strong>Industry-relevant TDS sections for {clientInfo?.nature?.label || "your business"}.</strong>{" "}
            Proposed clause numbers are as per the Income Tax Bill, 2025 — subject to final enactment.
            Rates &amp; thresholds shown are current (IT Act 1961) and remain substantively unchanged.
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a3a6b] text-white">
                  <th className="px-3 py-3 text-left font-semibold w-20">Current<br/>Section</th>
                  <th className="px-3 py-3 text-left font-semibold">TDS Provision</th>
                  <th className="px-3 py-3 text-left font-semibold w-24">New Clause<br/>(IT Bill 2025)</th>
                  <th className="px-3 py-3 text-left font-semibold w-24">Rate</th>
                  <th className="px-3 py-3 text-left font-semibold">Threshold</th>
                </tr>
              </thead>
              <tbody>
                {tdsSections.map((s, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-3 py-2.5 font-bold text-red-700 border-b border-gray-100 text-base">
                      {s.old}
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-gray-800 border-b border-gray-100">
                      {s.oldTitle}
                    </td>
                    <td className="px-3 py-2.5 font-bold text-[#4a7c59] border-b border-gray-100">
                      Cl. {s.newCl}
                    </td>
                    <td className="px-3 py-2.5 text-gray-700 border-b border-gray-100 text-xs font-semibold">
                      {s.rate}
                    </td>
                    <td className="px-3 py-2.5 text-gray-500 border-b border-gray-100 text-xs">
                      {s.threshold}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            <strong>Key point:</strong> TDS obligations, rates, and thresholds remain substantively unchanged.
            Only the section/clause numbers are renumbered in the new Act. Update TDS return software (TRACES),
            challan forms, and deductee certificates once CBDT issues updated forms post-enactment.
          </div>
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
