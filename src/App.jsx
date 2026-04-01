import { useState } from "react";
import "./index.css";

// Home
import HomeScreen from "./components/HomeScreen";

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
            <p className={`font-bold text-sm leading-tight ${light ? "text-[#1a3a6b]" : "text-white"}`}>K &amp; A</p>
            <p className={`text-xs leading-tight ${light ? "text-gray-500" : "text-blue-200"}`}>Compliance Pro</p>
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

// ─── Professional Tool ────────────────────────────────────────────────────────
function ProfessionalTool({ onHome }) {
  const [step, setStep] = useState(1);
  const [clientInfo, setClientInfo] = useState(null);
  const [selectedAssignments, setSelectedAssignments] = useState([]);

  function reset() { setStep(1); setClientInfo(null); setSelectedAssignments([]); }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      <AppHeader onHome={onHome} light />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <StepIndicator currentStep={step} />
        {step === 1 && <ClientInfoForm onNext={(info) => { setClientInfo(info); setStep(2); }} />}
        {step === 2 && (
          <AssignmentSelector
            clientInfo={clientInfo}
            onNext={(a) => { setSelectedAssignments(a); setStep(3); }}
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
function ClientPortal({ onHome }) {
  const [step, setStep] = useState(1);
  const [clientInfo, setClientInfo] = useState(null);
  const [reportType, setReportType] = useState(null);

  const portalSteps = [
    { num: 1, label: "Your Details" },
    { num: 2, label: "Report Type" },
    { num: 3, label: "Report" },
  ];

  function reset() { setStep(1); setClientInfo(null); setReportType(null); }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <AppHeader onHome={onHome} light />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Step indicator */}
        {step < 3 && (
          <div className="flex items-center justify-center gap-0 mb-8 no-print">
            {portalSteps.map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all
                    ${step === s.num ? "bg-[#1a3a6b] text-white shadow-lg scale-110" : step > s.num ? "bg-[#1a3a6b] text-white" : "bg-gray-200 text-gray-500"}`}>
                    {step > s.num ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : s.num}
                  </div>
                  <span className={`mt-1.5 text-xs font-medium whitespace-nowrap
                    ${step === s.num || step > s.num ? "text-[#1a3a6b]" : "text-gray-400"}`}>
                    {s.label}
                  </span>
                </div>
                {idx < portalSteps.length - 1 && (
                  <div className={`w-20 h-0.5 mx-2 mb-4 transition-all ${step > s.num ? "bg-[#1a3a6b]" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {step === 1 && (
          <ClientPortalForm onNext={(info) => { setClientInfo(info); setStep(2); }} />
        )}
        {step === 2 && (
          <ReportTypeSelector
            clientInfo={clientInfo}
            onSelect={(type) => { setReportType(type); setStep(3); }}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && reportType === "compliance" && (
          <ComplianceReport
            clientInfo={clientInfo}
            onBack={() => setStep(2)}
            onReset={reset}
          />
        )}
        {step === 3 && reportType === "requirement" && (
          <EnhancedRequirementForm
            clientInfo={clientInfo}
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
  const [mode, setMode] = useState("home");

  if (mode === "home") return <HomeScreen onSelectMode={setMode} />;
  if (mode === "portal") return <ClientPortal onHome={() => setMode("home")} />;
  if (mode === "professional") return <ProfessionalTool onHome={() => setMode("home")} />;
  return null;
}
