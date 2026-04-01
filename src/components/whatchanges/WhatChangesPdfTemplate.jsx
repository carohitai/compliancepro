/**
 * WhatChangesPdfTemplate — Off-screen A4 PDF template
 * Each section is its own div with a unique ID, captured independently.
 * Width: 794px (A4 at 96dpi). No page-break content cuts.
 */
import {
  NOMENCLATURE_CHANGES,
  OPERATIONAL_CHANGES,
  RATE_CHANGES,
  WHAT_STAYS_SAME,
  getBusinessHighlights,
  getTdsSectionsByIndustry,
} from "../../data/newTaxAct";

const KA_NAVY  = "#1a3a6b";
const KA_GREEN = "#8ab45a";
const TOTAL_PAGES = 6;

const DISCLAIMER =
  "This document is a system-generated compliance dashboard report produced by Kolte & Associates LLP. " +
  "It is intended solely for knowledge and information purposes. All facts, figures, and provisions are " +
  "based on the Income Tax Bill, 2025 as introduced in Parliament on 13 February 2025, and are subject to " +
  "amendments, notifications, and final enactment. The information herein should be independently verified " +
  "against the relevant statutory provisions and cross-checked with your professional consultant before any " +
  "reliance or action is taken. Action taken on the basis of this information shall be the sole responsibility " +
  "of the user. Kolte & Associates LLP, its partners, and associates shall not be liable for any loss, damage, " +
  "or consequence arising from the use of this report.";

const CONTACT = {
  emails: ["ca.rohit@Kolte.biz", "ca.pawan@kolte.biz"],
  phones: ["+91 9764488999", "+91 9049222233"],
};

// ── Shared page wrapper ────────────────────────────────────────────────────────
function Page({ id, children, noPad = false }) {
  return (
    <div id={id} style={{
      width: 794,
      fontFamily: "'Segoe UI', Arial, sans-serif",
      color: "#1f2937",
      background: "white",
      lineHeight: 1.5,
      padding: noPad ? 0 : "32px 40px 24px",
      boxSizing: "border-box",
    }}>
      {children}
    </div>
  );
}

// ── Per-page branded header ────────────────────────────────────────────────────
function PageHeader({ clientName, pageNum }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      borderBottom: `3px solid ${KA_NAVY}`, paddingBottom: 10, marginBottom: 20,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", gap: 2 }}>
          {["K", "&", "A"].map((ch, i) => (
            <div key={i} style={{
              width: 22, height: 24, background: KA_GREEN,
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 3,
            }}>
              <span style={{ color: KA_NAVY, fontWeight: 900, fontSize: 10, fontFamily: "Georgia, serif" }}>{ch}</span>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: KA_NAVY }}>Kolte &amp; Associates LLP, Chartered Accountants</div>
          <div style={{ fontSize: 7.5, color: "#6b7280" }}>New Income Tax Act 2025 — Personalised Impact Report</div>
        </div>
      </div>
      <div style={{ fontSize: 7.5, color: "#6b7280", textAlign: "right" }}>
        <div style={{ fontWeight: 600, color: "#374151" }}>{clientName}</div>
        <div>{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</div>
        <div style={{ color: "#9ca3af" }}>Page {pageNum} of {TOTAL_PAGES}</div>
      </div>
    </div>
  );
}

// ── Per-page footer ────────────────────────────────────────────────────────────
function PageFooter() {
  return (
    <div style={{
      marginTop: 20, paddingTop: 8,
      borderTop: "1px solid #e5e7eb",
      fontSize: 7, color: "#9ca3af", lineHeight: 1.5,
    }}>
      System-generated compliance report for knowledge purposes only. Cross-check with your professional consultant
      before acting. Responsibility for use of this information rests solely with the user. &nbsp;·&nbsp;
      Kolte &amp; Associates LLP &nbsp;·&nbsp; ca.rohit@Kolte.biz &nbsp;|&nbsp; +91 9764488999
    </div>
  );
}

// ── Section title bar ──────────────────────────────────────────────────────────
function SectionTitle({ icon, title, subtitle }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${KA_NAVY}, #2a5298)`,
      borderRadius: 8, padding: "10px 16px", marginBottom: 14, color: "white",
    }}>
      <div style={{ fontSize: 13, fontWeight: 800 }}>{icon} {title}</div>
      {subtitle && <div style={{ fontSize: 8.5, color: "#bfdbfe", marginTop: 2 }}>{subtitle}</div>}
    </div>
  );
}

// ── Impact badge ───────────────────────────────────────────────────────────────
function ImpactBadge({ impact }) {
  const style = {
    High:   { background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5" },
    Medium: { background: "#fef3c7", color: "#d97706", border: "1px solid #fcd34d" },
    Low:    { background: "#dcfce7", color: "#16a34a", border: "1px solid #86efac" },
  }[impact] || {};
  return (
    <div style={{
      flexShrink: 0, padding: "2px 8px", borderRadius: 20,
      fontSize: 7.5, fontWeight: 800, marginTop: 3, ...style,
    }}>
      {impact}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function WhatChangesPdfTemplate({ clientInfo }) {
  const natureValue = clientInfo?.nature?.value || "default";
  const highlights  = getBusinessHighlights(natureValue);
  const tdsSections = getTdsSectionsByIndustry(natureValue);
  const name        = clientInfo?.name || "Taxpayer";
  const nature      = clientInfo?.nature?.label || "Business";
  const today       = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const refNo       = `KA/WCM/${Date.now().toString(36).toUpperCase().slice(-6)}`;

  return (
    <div id="wcm-pdf-template" style={{ width: 794, background: "white" }}>

      {/* ═══════════════════════════════════════ PAGE 1 — COVER */}
      <Page id="wcm-page-cover" noPad>
        {/* Top brand bar */}
        <div style={{
          background: `linear-gradient(135deg, ${KA_NAVY} 0%, #2a5298 100%)`,
          padding: "28px 40px", color: "white",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        }}>
          <div>
            <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
              {["K", "&", "A"].map((ch, i) => (
                <div key={i} style={{
                  width: 38, height: 42, background: KA_GREEN,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: 5, boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                }}>
                  <span style={{ color: KA_NAVY, fontWeight: 900, fontSize: 17, fontFamily: "Georgia, serif" }}>{ch}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 0.5 }}>Kolte &amp; Associates LLP</div>
            <div style={{ fontSize: 10, color: KA_GREEN, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 2 }}>
              Chartered Accountants
            </div>
            <div style={{ fontSize: 8.5, color: "#93c5fd", marginTop: 6 }}>
              ca.rohit@Kolte.biz &nbsp;·&nbsp; ca.pawan@kolte.biz
            </div>
            <div style={{ fontSize: 8.5, color: "#93c5fd" }}>
              +91 9764488999 &nbsp;·&nbsp; +91 9049222233
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{
              display: "inline-block", background: KA_GREEN, color: KA_NAVY,
              fontSize: 8.5, fontWeight: 800, padding: "4px 14px", borderRadius: 20,
              letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10,
            }}>Special Report</div>
            <div style={{ fontSize: 8.5, color: "#bfdbfe" }}>Ref: {refNo}</div>
            <div style={{ fontSize: 8.5, color: "#bfdbfe" }}>Date: {today}</div>
            <div style={{ fontSize: 8.5, color: "#bfdbfe", marginTop: 4 }}>Income Tax Bill, 2025</div>
            <div style={{ fontSize: 8.5, color: "#bfdbfe" }}>Introduced: 13 February 2025</div>
          </div>
        </div>

        {/* Report title */}
        <div style={{ padding: "28px 40px 20px", textAlign: "center", borderBottom: `4px solid ${KA_GREEN}` }}>
          <div style={{ fontSize: 10, color: KA_GREEN, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>
            Personalised Impact Report
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: KA_NAVY, lineHeight: 1.2, marginBottom: 4 }}>
            New Income Tax Act 2025
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
            What Changes For Me?
          </div>
          <div style={{ fontSize: 10, color: "#6b7280", marginTop: 6 }}>
            Effective from <strong style={{ color: KA_NAVY }}>Tax Year 2026-27</strong> &nbsp;·&nbsp;
            Replaces Income Tax Act, 1961 (536 clauses · 16 schedules)
          </div>
        </div>

        {/* Client band */}
        <div style={{
          margin: "20px 40px", background: "#f0f4ff",
          border: `1px solid #c7d2f8`, borderRadius: 10, padding: "14px 20px",
          display: "flex", gap: 40, alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 8, color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Prepared For</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: KA_NAVY, marginTop: 2 }}>{name}</div>
          </div>
          <div>
            <div style={{ fontSize: 8, color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Business / Profession</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginTop: 2 }}>{nature}</div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <div style={{ fontSize: 8, color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Generated On</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#374151", marginTop: 2 }}>{today}</div>
          </div>
        </div>

        {/* Top priorities */}
        {highlights.topChanges.length > 0 && (
          <div style={{ margin: "0 40px", background: "#f8faff", border: `1px solid ${KA_NAVY}25`, borderRadius: 10, padding: "14px 18px" }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: KA_GREEN, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
              🎯 Top Priorities for {nature}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 20px" }}>
              {highlights.topChanges.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 8, fontSize: 9.5, color: "#1f2937" }}>
                  <span style={{ color: KA_GREEN, fontWeight: 800, flexShrink: 0 }}>→</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contents overview */}
        <div style={{ margin: "20px 40px 0" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: KA_NAVY, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
            Report Contents
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
            {[
              { pg: "2", icon: "📝", label: "Nomenclature\nChanges" },
              { pg: "3", icon: "⚙️", label: "Operational\nChanges" },
              { pg: "4", icon: "📊", label: "Rate\nChanges" },
              { pg: "5", icon: "🔢", label: "TDS Section\nRenumbering" },
              { pg: "6", icon: "✅", label: "What Does\nNot Change" },
              { pg: "—", icon: "📞", label: "Expert\nGuidance" },
            ].map((item) => (
              <div key={item.pg} style={{ background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 7, padding: "10px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 14, marginBottom: 3 }}>{item.icon}</div>
                <div style={{ fontSize: 7.5, fontWeight: 700, color: KA_NAVY, whiteSpace: "pre-line", lineHeight: 1.3 }}>{item.label}</div>
                <div style={{ fontSize: 7, color: "#9ca3af", marginTop: 3 }}>Pg {item.pg}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cover disclaimer */}
        <div style={{ margin: "18px 40px 24px", paddingTop: 14, borderTop: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: 7, color: "#9ca3af", lineHeight: 1.6 }}>
            <strong style={{ color: "#6b7280" }}>DISCLAIMER: </strong>{DISCLAIMER}
          </div>
        </div>
      </Page>

      {/* ═══════════════════════════════════════ PAGE 2 — NOMENCLATURE */}
      <Page id="wcm-page-nomenclature">
        <PageHeader clientName={name} pageNum={2} />
        <SectionTitle icon="📝" title="Change in Nomenclature"
          subtitle={`${NOMENCLATURE_CHANGES.length} legal terms renamed — All IT Dept forms, notices, and orders will use new terminology from Tax Year 2026-27`} />

        <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 7, padding: "9px 12px", marginBottom: 12, fontSize: 9, color: "#92400e" }}>
          <strong>What this means for you:</strong> All income tax forms, notices, scrutiny orders, and legal references
          from the Income Tax Department will shift to new terminology. Update contract clauses and board resolutions accordingly.
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 9 }}>
          <thead>
            <tr style={{ background: KA_NAVY }}>
              <th style={{ padding: "9px 11px", textAlign: "left", color: "white", fontWeight: 700, width: "33%" }}>Old Term — IT Act 1961</th>
              <th style={{ padding: "9px 11px", textAlign: "left", color: "white", fontWeight: 700, width: "28%" }}>New Term — IT Bill 2025</th>
              <th style={{ padding: "9px 11px", textAlign: "left", color: "white", fontWeight: 700 }}>What It Means for You</th>
            </tr>
          </thead>
          <tbody>
            {NOMENCLATURE_CHANGES.map((item, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#f9fafb" }}>
                <td style={{ padding: "7px 11px", color: "#dc2626", textDecoration: "line-through", fontWeight: 600, borderBottom: "1px solid #f3f4f6", fontSize: 8.5 }}>{item.old}</td>
                <td style={{ padding: "7px 11px", color: "#166534", fontWeight: 700, borderBottom: "1px solid #f3f4f6", fontSize: 8.5 }}>{item.newTerm}</td>
                <td style={{ padding: "7px 11px", color: "#4b5563", fontSize: 8, lineHeight: 1.4, borderBottom: "1px solid #f3f4f6" }}>{item.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <PageFooter />
      </Page>

      {/* ═══════════════════════════════════════ PAGE 3 — OPERATIONS */}
      <Page id="wcm-page-operations">
        <PageHeader clientName={name} pageNum={3} />
        <SectionTitle icon="⚙️" title="Changes in Operations"
          subtitle="New digital procedures, faceless mandate, and compliance workflow changes" />

        <div style={{ fontSize: 9.5, fontWeight: 800, color: KA_NAVY, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, paddingBottom: 4, borderBottom: `2px solid ${KA_GREEN}` }}>
          Applies to All Taxpayers
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16 }}>
          {OPERATIONAL_CHANGES.all.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "9px 11px", background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 7 }}>
              <ImpactBadge impact={item.impact} />
              <div>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: "#1f2937", marginBottom: 2 }}>{item.title}</div>
                <div style={{ fontSize: 8.5, color: "#4b5563", lineHeight: 1.4 }}>{item.description}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 9.5, fontWeight: 800, color: "#16a34a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, paddingBottom: 4, borderBottom: `2px solid ${KA_GREEN}` }}>
          Business &amp; Professional Specific
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {[...(OPERATIONAL_CHANGES.business || []), ...(OPERATIONAL_CHANGES.professional || [])].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "9px 11px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 7 }}>
              <ImpactBadge impact={item.impact} />
              <div>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: "#1f2937", marginBottom: 2 }}>{item.title}</div>
                <div style={{ fontSize: 8.5, color: "#4b5563", lineHeight: 1.4 }}>{item.description}</div>
              </div>
            </div>
          ))}
        </div>
        <PageFooter />
      </Page>

      {/* ═══════════════════════════════════════ PAGE 4 — RATES */}
      <Page id="wcm-page-rates">
        <PageHeader clientName={name} pageNum={4} />
        <SectionTitle icon="📊" title="Change in Rates"
          subtitle="Updated tax slabs, capital gains rates, and key deduction limits" />

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {RATE_CHANGES.map((cat, ci) => (
            <div key={ci} style={{ border: `1px solid ${cat.changed ? "#fcd34d" : "#e5e7eb"}`, borderRadius: 7, overflow: "hidden" }}>
              <div style={{ background: cat.changed ? "#fffbeb" : "#f8fafc", padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: "#1f2937" }}>{cat.category}</div>
                {cat.changed && (
                  <div style={{ background: "#fef08a", color: "#854d0e", fontSize: 7.5, fontWeight: 800, padding: "2px 10px", borderRadius: 20, border: "1px solid #fcd34d" }}>
                    CHANGED ⚠
                  </div>
                )}
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 9 }}>
                <thead>
                  <tr style={{ background: KA_NAVY }}>
                    <th style={{ padding: "7px 11px", textAlign: "left", color: "white", fontWeight: 700 }}>Income Range / Category</th>
                    <th style={{ padding: "7px 11px", textAlign: "left", color: "white", fontWeight: 700, width: "28%" }}>Tax Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.slabs.map((s, si) => (
                    <tr key={si} style={{ background: si % 2 === 0 ? "white" : "#f9fafb" }}>
                      <td style={{ padding: "6px 11px", borderBottom: "1px solid #f3f4f6", fontSize: 8.5 }}>{s.income}</td>
                      <td style={{ padding: "6px 11px", fontWeight: 700, fontSize: 8.5, color: s.rate.includes("was") ? "#d97706" : "#166534", borderBottom: "1px solid #f3f4f6" }}>{s.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {cat.note && (
                <div style={{ padding: "7px 11px", background: "#eff6ff", borderTop: "1px solid #bfdbfe", fontSize: 8, color: "#1d4ed8" }}>
                  ℹ {cat.note}
                </div>
              )}
            </div>
          ))}
        </div>
        <PageFooter />
      </Page>

      {/* ═══════════════════════════════════════ PAGE 5 — TDS SECTION RENUMBERING */}
      <Page id="wcm-page-tds">
        <PageHeader clientName={name} pageNum={5} />
        <SectionTitle icon="🔢" title="TDS Section Renumbering"
          subtitle={`Industry-relevant TDS sections for ${nature} — Old (IT Act 1961) vs. Proposed New (IT Bill 2025, Ch. XIX)`} />

        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 7, padding: "9px 12px", marginBottom: 12, fontSize: 8.5, color: "#1e40af" }}>
          <strong>Note:</strong> Proposed clause numbers are as per the Income Tax Bill, 2025 (Lok Sabha). These are subject to
          amendment during Parliamentary consideration and final enactment. Rates and thresholds shown are as per IT Act 1961 (current law).
          Verify the final enacted numbers upon gazette notification.
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 8.5 }}>
          <thead>
            <tr style={{ background: KA_NAVY }}>
              <th style={{ padding: "9px 10px", textAlign: "left", color: "white", fontWeight: 700, width: "10%" }}>Current<br/>Section</th>
              <th style={{ padding: "9px 10px", textAlign: "left", color: "white", fontWeight: 700, width: "34%" }}>TDS Provision</th>
              <th style={{ padding: "9px 10px", textAlign: "left", color: "white", fontWeight: 700, width: "10%" }}>New<br/>Clause</th>
              <th style={{ padding: "9px 10px", textAlign: "left", color: "white", fontWeight: 700, width: "14%" }}>Rate</th>
              <th style={{ padding: "9px 10px", textAlign: "left", color: "white", fontWeight: 700 }}>Threshold</th>
            </tr>
          </thead>
          <tbody>
            {tdsSections.map((s, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#f9fafb" }}>
                <td style={{ padding: "7px 10px", fontWeight: 800, color: "#dc2626", borderBottom: "1px solid #f3f4f6", fontSize: 9 }}>
                  {s.old}
                </td>
                <td style={{ padding: "7px 10px", color: "#1f2937", fontWeight: 600, borderBottom: "1px solid #f3f4f6" }}>
                  {s.oldTitle}
                </td>
                <td style={{ padding: "7px 10px", fontWeight: 800, color: "#166534", borderBottom: "1px solid #f3f4f6", fontSize: 9 }}>
                  Cl. {s.newCl}
                </td>
                <td style={{ padding: "7px 10px", color: "#374151", fontWeight: 600, borderBottom: "1px solid #f3f4f6" }}>
                  {s.rate}
                </td>
                <td style={{ padding: "7px 10px", color: "#6b7280", borderBottom: "1px solid #f3f4f6", fontSize: 8 }}>
                  {s.threshold}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 12, padding: "8px 12px", background: "#fafafa", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 7.5, color: "#6b7280", lineHeight: 1.5 }}>
          <strong>Key Change:</strong> TDS section numbers are renumbered sequentially in the new Act but <em>obligations, rates, and thresholds
          remain substantively unchanged</em> unless otherwise stated. Review challan forms, TDS return software (TRACES), and deductee certificates
          once the Act is enacted and CBDT issues updated forms.
        </div>
        <PageFooter />
      </Page>

      {/* ═══════════════════════════════════════ PAGE 6 — WHAT STAYS SAME + CONTACT */}
      <Page id="wcm-page-unchanged">
        <PageHeader clientName={name} pageNum={6} />
        <SectionTitle icon="✅" title="What Does Not Change"
          subtitle="Core obligations that remain identical — your existing compliance calendar needs minimal revision" />

        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 7, padding: "9px 12px", marginBottom: 12, fontSize: 9, color: "#166534" }}>
          <strong>Good news:</strong> Despite the major structural overhaul, existing compliance processes — TDS, GST, advance tax, audit,
          return filing — continue without disruption. Only the language and section references change.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 24 }}>
          {WHAT_STAYS_SAME.map((item, i) => (
            <div key={i} style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 7, padding: "9px 11px", display: "flex", gap: 7 }}>
              <span style={{ color: "#16a34a", fontSize: 12, flexShrink: 0, marginTop: 1 }}>✓</span>
              <div>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: "#1f2937", marginBottom: 2 }}>{item.point}</div>
                <div style={{ fontSize: 8, color: "#4b5563", lineHeight: 1.4 }}>{item.detail}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Expert guidance CTA */}
        <div style={{
          background: `linear-gradient(135deg, ${KA_NAVY}, #2a5298)`,
          borderRadius: 10, padding: "18px 22px", color: "white", marginBottom: 18,
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 4 }}>Need Expert Guidance?</div>
          <div style={{ fontSize: 9, color: "#bfdbfe", marginBottom: 12, lineHeight: 1.5 }}>
            This report provides a structured overview of the key changes introduced by the New Income Tax Act 2025.
            For personalised tax planning, compliance implementation, and advisory specific to your business — connect with our team.
          </div>
          <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 7.5, color: KA_GREEN, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Email Us</div>
              {CONTACT.emails.map((e, i) => (
                <div key={i} style={{ fontSize: 9.5, color: "white", fontWeight: 600, marginBottom: 3 }}>📧 {e}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 7.5, color: KA_GREEN, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Call / WhatsApp</div>
              {CONTACT.phones.map((p, i) => (
                <div key={i} style={{ fontSize: 9.5, color: "white", fontWeight: 600, marginBottom: 3 }}>📱 {p}</div>
              ))}
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 8.5, color: "#93c5fd" }}>🌐 Full interactive report</div>
                <div style={{ fontSize: 8, color: "#bfdbfe" }}>carohitai.github.io/compliancepro</div>
              </div>
            </div>
          </div>
        </div>

        {/* Full disclaimer */}
        <div style={{ background: "#fafafa", border: "1px solid #e5e7eb", borderRadius: 8, padding: "14px 16px" }}>
          <div style={{ fontSize: 9.5, fontWeight: 800, color: "#374151", marginBottom: 7 }}>
            ⚠️ Disclaimer &amp; Important Notice
          </div>
          <div style={{ fontSize: 8, color: "#4b5563", lineHeight: 1.7 }}>
            {DISCLAIMER}
          </div>
          <div style={{ marginTop: 9, paddingTop: 7, borderTop: "1px dashed #d1d5db", fontSize: 7.5, color: "#6b7280", lineHeight: 1.5 }}>
            <strong>Sources:</strong> Income Tax Bill, 2025 (Lok Sabha) · incometaxindia.gov.in · PRS Legislative Research · ICAI ·
            Finance Act 2024 &nbsp;·&nbsp; <strong>Report Ref:</strong> {refNo} &nbsp;·&nbsp;
            <strong>Generated:</strong> {today}
          </div>
        </div>

        <PageFooter />
      </Page>

    </div>
  );
}
