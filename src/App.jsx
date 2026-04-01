import { useState } from "react";
import StepIndicator from "./components/StepIndicator";
import ClientInfoForm from "./components/ClientInfoForm";
import AssignmentSelector from "./components/AssignmentSelector";
import RequirementReport from "./components/RequirementReport";
import "./index.css";

export default function App() {
  const [step, setStep] = useState(1);
  const [clientInfo, setClientInfo] = useState(null);
  const [selectedAssignments, setSelectedAssignments] = useState([]);

  function handleClientNext(info) {
    setClientInfo(info);
    setStep(2);
  }

  function handleAssignmentNext(assignments) {
    setSelectedAssignments(assignments);
    setStep(3);
  }

  function handleReset() {
    setStep(1);
    setClientInfo(null);
    setSelectedAssignments([]);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Top bar */}
      <header className="bg-[#1a3a6b] text-white no-print">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {["K", "&", "A"].map((ch, i) => (
                <div
                  key={i}
                  className="w-7 h-8 bg-[#8ab45a] flex items-center justify-center rounded-sm"
                >
                  <span className="text-[#1a3a6b] font-serif font-bold text-sm">{ch}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">K &amp; A</p>
              <p className="text-blue-200 text-xs leading-tight">Compliance Pro</p>
            </div>
          </div>
          <p className="text-blue-200 text-xs hidden sm:block">Requirement Generator</p>
        </div>
      </header>

      {/* Print-only header */}
      <div className="print-only text-center py-4 border-b border-gray-200 mb-4">
        <p className="text-lg font-bold text-[#1a3a6b]">K &amp; A — Compliance Requirement Report</p>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <StepIndicator currentStep={step} />

        {step === 1 && <ClientInfoForm onNext={handleClientNext} />}
        {step === 2 && (
          <AssignmentSelector
            clientInfo={clientInfo}
            onNext={handleAssignmentNext}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <RequirementReport
            clientInfo={clientInfo}
            selectedAssignments={selectedAssignments}
            onBack={() => setStep(2)}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}
