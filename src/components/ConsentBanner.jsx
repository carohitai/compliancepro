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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#1a3a6b] px-6 py-4 flex items-center gap-3">
          <div className="flex gap-0.5 flex-shrink-0">
            {["K", "&", "A"].map((ch, i) => (
              <div key={i} className="w-6 h-7 bg-[#8ab45a] flex items-center justify-center rounded-sm">
                <span className="text-[#1a3a6b] font-serif font-bold text-xs">{ch}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Kolte &amp; Associates LLP</p>
            <p className="text-blue-300 text-xs">Chartered Accountants</p>
          </div>
        </div>

        <div className="px-6 py-5">
          <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span className="text-xl">🔒</span> Data Privacy &amp; Consent Notice
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            In accordance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> and applicable
            provisions of the <strong>Information Technology Act, 2000</strong>, we inform you that by using this portal,
            you are providing your voluntary, informed and explicit consent to the following:
          </p>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-3 text-sm space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-[#1a3a6b] font-bold flex-shrink-0">1.</span>
              <p className="text-gray-700"><strong>Data Collection:</strong> Your name, email, mobile number, business details, tax registration numbers and uploaded documents will be collected and stored securely.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#1a3a6b] font-bold flex-shrink-0">2.</span>
              <p className="text-gray-700"><strong>Purpose:</strong> Data is collected exclusively for generating compliance and requirement reports and for professional engagement by Kolte &amp; Associates LLP, Chartered Accountants.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#1a3a6b] font-bold flex-shrink-0">3.</span>
              <p className="text-gray-700"><strong>Data Sharing:</strong> Your data will be shared with and accessible to Kolte &amp; Associates LLP and its authorised professionals only. It will not be sold, rented or disclosed to any third party without your consent.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#1a3a6b] font-bold flex-shrink-0">4.</span>
              <p className="text-gray-700"><strong>AI Processing:</strong> Uploaded documents may be processed by AI tools to extract and summarise relevant financial information for your benefit.</p>
            </div>
            {expanded && (
              <>
                <div className="flex items-start gap-2">
                  <span className="text-[#1a3a6b] font-bold flex-shrink-0">5.</span>
                  <p className="text-gray-700"><strong>Data Retention:</strong> Your data will be retained for a period of 7 years in compliance with Indian accounting and tax law requirements, or until you request deletion.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#1a3a6b] font-bold flex-shrink-0">6.</span>
                  <p className="text-gray-700"><strong>Your Rights (DPDP Act 2023):</strong> You have the right to access, correct and erase your personal data. To exercise these rights, contact us at <strong>privacy@kolteassociates.in</strong></p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#1a3a6b] font-bold flex-shrink-0">7.</span>
                  <p className="text-gray-700"><strong>Grievance Officer:</strong> As required under IT Act 2000 and DPDP Act 2023, our Grievance Officer can be contacted at the registered office of Kolte &amp; Associates LLP.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#1a3a6b] font-bold flex-shrink-0">8.</span>
                  <p className="text-gray-700"><strong>Security:</strong> Data is stored on encrypted servers. We follow ISO 27001 aligned security practices to protect your information.</p>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-[#1a3a6b] font-semibold underline mb-4 block"
          >
            {expanded ? "Show Less ▲" : "Read Full Privacy Notice ▼"}
          </button>

          <p className="text-xs text-gray-500 mb-4">
            By clicking <strong>"I Accept &amp; Continue"</strong>, you confirm that you have read, understood and
            voluntarily consent to the collection, processing and sharing of your data as described above,
            in accordance with the DPDP Act 2023.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={accept}
              className="flex-1 bg-[#1a3a6b] hover:bg-[#152f59] text-white font-bold py-3 px-6 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>✓</span> I Accept &amp; Continue
            </button>
            <a
              href="https://www.meity.gov.in/data-protection-framework"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold py-3 px-6 rounded-xl text-sm text-center transition-all"
            >
              Learn about DPDP Act 2023
            </a>
          </div>

          <p className="text-xs text-gray-400 mt-3 text-center">
            Kolte &amp; Associates LLP · Chartered Accountants · ICAI Reg. No. ________
          </p>
        </div>
      </div>
    </div>
  );
}
