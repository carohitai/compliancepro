import { useState, useEffect } from "react";

const CONSENT_KEY = "ka_consent_v1";

export default function ConsentBanner({ onAccept }) {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) setVisible(true);
    else onAccept(JSON.parse(stored));
  }, []);

  function accept() {
    const consent = {
      given: true,
      timestamp: new Date().toISOString(),
      version: "1.0",
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    setVisible(false);
    onAccept(consent);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      {/* Modal — flex column, capped height so footer button always shows */}
      <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: "90vh", height: "auto" }}>

        {/* ── Fixed header ────────────────────────────────── */}
        <div className="bg-[#1a3a6b] px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 flex-shrink-0 rounded-t-2xl sm:rounded-t-2xl">
          <div className="flex gap-0.5 flex-shrink-0">
            {["K", "&", "A"].map((ch, i) => (
              <div key={i} className="w-6 h-7 bg-[#8ab45a] flex items-center justify-center rounded-sm">
                <span className="text-[#1a3a6b] font-serif font-bold text-xs">{ch}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Kolte &amp; Associates LLP</p>
            <p className="text-blue-300 text-xs">Chartered Accountants · Data Privacy Notice</p>
          </div>
        </div>

        {/* ── Scrollable body ──────────────────────────────── */}
        <div className="overflow-y-auto flex-1 min-h-0 px-4 sm:px-6 py-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span>🔒</span> Data Privacy &amp; Consent Notice
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            In accordance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> and applicable
            provisions of the <strong>Information Technology Act, 2000</strong>, we inform you that by using this portal,
            you are providing your voluntary, informed and explicit consent to the following:
          </p>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 sm:p-4 mb-3 text-sm space-y-2.5">
            {[
              { n: 1, title: "Data Collection", text: "Your name, email, mobile number, business details, tax registration numbers and uploaded documents will be collected and stored securely." },
              { n: 2, title: "Purpose", text: "Data is collected exclusively for generating compliance and requirement reports and for professional engagement by Kolte & Associates LLP, Chartered Accountants." },
              { n: 3, title: "Data Sharing", text: "Your data will be shared with and accessible to Kolte & Associates LLP and its authorised professionals only. It will not be sold, rented or disclosed to any third party without your consent." },
              { n: 4, title: "AI Processing", text: "Uploaded documents may be processed by AI tools to extract and summarise relevant financial information for your benefit." },
            ].map(({ n, title, text }) => (
              <div key={n} className="flex items-start gap-2">
                <span className="text-[#1a3a6b] font-bold flex-shrink-0 w-4">{n}.</span>
                <p className="text-gray-700"><strong>{title}:</strong> {text}</p>
              </div>
            ))}

            {expanded && (
              <>
                {[
                  { n: 5, title: "Data Retention", text: "Your data will be retained for a period of 7 years in compliance with Indian accounting and tax law requirements, or until you request deletion." },
                  { n: 6, title: "Your Rights (DPDP Act 2023)", text: "You have the right to access, correct and erase your personal data. To exercise these rights, contact us at privacy@kolteassociates.in" },
                  { n: 7, title: "Grievance Officer", text: "As required under IT Act 2000 and DPDP Act 2023, our Grievance Officer can be contacted at the registered office of Kolte & Associates LLP." },
                  { n: 8, title: "Security", text: "Data is stored on encrypted servers. We follow ISO 27001 aligned security practices to protect your information." },
                ].map(({ n, title, text }) => (
                  <div key={n} className="flex items-start gap-2">
                    <span className="text-[#1a3a6b] font-bold flex-shrink-0 w-4">{n}.</span>
                    <p className="text-gray-700"><strong>{title}:</strong> {text}</p>
                  </div>
                ))}
              </>
            )}
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-[#1a3a6b] font-semibold underline mb-3 block"
          >
            {expanded ? "Show Less ▲" : "Read Full Privacy Notice ▼"}
          </button>

          <p className="text-xs text-gray-500">
            By clicking <strong>"I Accept &amp; Continue"</strong>, you confirm that you have read, understood and
            voluntarily consent to the collection, processing and sharing of your data as described above,
            in accordance with the DPDP Act 2023.
          </p>
        </div>

        {/* ── Pinned footer — always visible ──────────────── */}
        <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-t border-gray-100 bg-white rounded-b-2xl space-y-2.5">
          <button
            onClick={accept}
            className="w-full bg-[#1a3a6b] hover:bg-[#152f59] text-white font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
          >
            <span>✓</span> I Accept &amp; Continue
          </button>
          <a
            href="https://www.meity.gov.in/data-protection-framework"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold py-2.5 rounded-xl text-sm text-center block transition-all"
          >
            Learn about DPDP Act 2023
          </a>
          <p className="text-xs text-gray-400 text-center">
            Kolte &amp; Associates LLP · Chartered Accountants · ICAI Reg. No. ________
          </p>
        </div>
      </div>
    </div>
  );
}
