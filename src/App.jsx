import { useState } from "react";
import "./index.css";

// Home + shared
import HomeScreen from "./components/HomeScreen";
import ConsentBanner from "./components/ConsentBanner";

// Professional tool (existing flow)
import StepIndicator from "./components/StepIndicator";
import ClientInfoForm from "./components/ClientInfoForm";
import AssignmentSelector from "./components/AssignmentSelector";
import RequirementReport from "./components/RequirementReport";

// Client portal (new flow)
import ClientPortalForm from "./components/portal/ClientPortalForm";
import ReportTypeSelector from "./components/portal/ReportTypeSelector";
import ComplianceReport from "./components/compliance/ComplianceReport";
import EnhancedRequirementForm from "./components/requirement/EnhancedRequirementForm";

// What Changes For Me
import WhatChangesQuickForm from "./components/whatchanges/WhatChangesQuickForm";
import WhatChangesForMe from "./components/compliance/WhatChangesForMe";

// Dashboard
import Dashboard from "./components/dashboard/Dashboard";

// DB save helpers
import { savePortalSubmission, saveProfessionalSubmission } from "./lib/saveSubmission";

// ─── Shared header ────────────────────────────────────────────────────────────
function AppHeader({ onHome, light = false }) {
  return (
    <header className={`no-print ${light ? "bg-white border-b border-gray-200" : "bg-[#1a3a6b]"}`}>
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={onHome} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="flex gap-0.5">
            {["K", "&", "A"].map((ch, i) => (
              <div key={i} className="w-7 h-8 bg-[#8ab45a] flex items-center justify-center rounded-sm">
                <span className="text-[#1a3a6b] font-serif font-bold text-sm">{ch}</span>
              </div>
            ))}
          </div>
          <div>
            <p className={`font-bold text-sm leading-tight ${light ? "text-[#1a3a6b]" : "text-white"}`}>Kolte &amp; Associates LLP</p>
            <p className={`text-xs leading-tight ${light ? "text-gray-500" : "text-blue-200"}`}>Chartered Accountants · Compliance Pro</p>
          </div>
        </button>
        <button
          onClick={onHome}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all
            ${light ? "text-gray-500 hover:bg-gray-100" : "text-blue-200 hover:bg-white/10"}`}
        >
          ← Home
        </button>
      </div>
    </header>
  );
}

// ─── Portal step indicator ────────────────────────────────────────────────────
function PortalStepIndicator({ step, steps, accentColor = "#1a3a6b" }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8 no-print">
      {steps.map((s, idx) => (
        <div key={s.num} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all"
              style={{
                backgroundColor: step >= s.num ? accentColor : "#e5e7eb",
                color: step >= s.num ? "white" : "#6b7280",
                transform: step === s.num ? "scale(1.1)" : "scale(1)",
              }}
            >
              {step > s.num ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : s.num}
            </div>
            <span className="mt-1.5 text-xs font-medium whitespace-nowrap" style={{ color: step >= s.num ? accentColor : "#9ca3af" }}>
              {s.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className="w-20 h-0.5 mx-2 mb-4 transition-all" style={{ backgroundColor: step > s.num ? accentColor : "#e5e7eb" }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── What Changes For Me ──────────────────────────────────────────────────────
function WhatChangesPortal({ onHome }) {
  const [clientInfo, setClientInfo] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50">
      <AppHeader onHome={onHome} light />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {!clientInfo ? (
          <WhatChangesQuickForm onSubmit={setClientInfo} />
        ) : (
          <>
            <WhatChangesForMe clientInfo={clientInfo} />
            <div className="mt-6 text-center no-print">
              <button
                onClick={() => setClientInfo(null)}
                className="text-sm text-gray-500 hover:text-[#1a3a6b] underline"
              >
                ← Change details
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// ─── Professional Tool ────────────────────────────────────────────────────────
function ProfessionalTool({ onHome, consent }) {
  const [step, setStep] = useState(1);
  const [clientInfo, setClientInfo] = useState(null);
  const [selectedAssignments, setSelectedAssignments] = useState([]);

  function reset() { setStep(1); setClientInfo(null); setSelectedAssignments([]); }

  async function handleAssignments(assignments) {
    setSelectedAssignments(assignments);
    setStep(3);
    saveProfessionalSubmission({ clientInfo, selectedAssignments: assignments, consent });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      <AppHeader onHome={onHome} light />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <StepIndicator currentStep={step} />
        {step === 1 && <ClientInfoForm onNext={(info) => { setClientInfo(info); setStep(2); }} />}
        {step === 2 && (
          <AssignmentSelector
            clientInfo={clientInfo}
            onNext={handleAssignments}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <RequirementReport
            clientInfo={clientInfo}
            selectedAssignments={selectedAssignments}
            onBack={() => setStep(2)}
            onReset={reset}
          />
        )}
      </main>
    </div>
  );
}

// ─── Client Portal ────────────────────────────────────────────────────────────
const PORTAL_STEPS = [
  { num: 1, label: "Your Details" },
  { num: 2, label: "Report Type" },
  { num: 3, label: "Report" },
];

function ClientPortal({ onHome, consent }) {
  const [step, setStep] = useState(1);
  const [clientInfo, setClientInfo] = useState(null);
  const [reportType, setReportType] = useState(null);

  function reset() { setStep(1); setClientInfo(null); setReportType(null); }

  async function handleReportType(type) {
    setReportType(type);
    setStep(3);
    // Save basic submission (files saved later in EnhancedRequirementForm)
    savePortalSubmission({ clientInfo, reportType: type, consent });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <AppHeader onHome={onHome} light />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {step < 3 && (
          <PortalStepIndicator step={step} steps={PORTAL_STEPS} accentColor="#1a3a6b" />
        )}
        {step === 1 && (
          <ClientPortalForm onNext={(info) => { setClientInfo(info); setStep(2); }} />
        )}
        {step === 2 && (
          <ReportTypeSelector
            clientInfo={clientInfo}
            onSelect={handleReportType}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && reportType === "compliance" && (
          <ComplianceReport clientInfo={clientInfo} onBack={() => setStep(2)} onReset={reset} />
        )}
        {step === 3 && reportType === "requirement" && (
          <EnhancedRequirementForm
            clientInfo={clientInfo}
            consent={consent}
            onBack={() => setStep(2)}
            onReset={reset}
          />
        )}
      </main>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode] = useState(() => {
    // Support hash-based dashboard route: #/dashboard
    return window.location.hash === "#/dashboard" ? "dashboard" : "home";
  });
  const [consent, setConsent] = useState(null);

  function handleConsent(c) { setConsent(c); }

  function selectMode(m) {
    setMode(m);
    if (m === "dashboard") window.location.hash = "/dashboard";
    else window.location.hash = "";
  }

  if (mode === "dashboard") return <Dashboard onHome={() => selectMode("home")} />;

  return (
    <>
      {/* Consent banner — shown before any interaction */}
      <ConsentBanner onAccept={handleConsent} />

      {mode === "home" && <HomeScreen onSelectMode={selectMode} />}
      {mode === "portal" && <ClientPortal onHome={() => selectMode("home")} consent={consent} />}
      {mode === "whatchanges" && <WhatChangesPortal onHome={() => selectMode("home")} />}
      {mode === "professional" && <ProfessionalTool onHome={() => selectMode("home")} consent={consent} />}
    </>
  );
}
