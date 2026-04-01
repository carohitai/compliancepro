export default function StepIndicator({ currentStep }) {
  const steps = [
    { num: 1, label: "Client Information" },
    { num: 2, label: "Select Assignments" },
    { num: 3, label: "Requirement Report" },
  ];

  return (
    <div className="flex items-center justify-center gap-0 mb-8 no-print">
      {steps.map((step, idx) => (
        <div key={step.num} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all
                ${currentStep === step.num
                  ? "bg-[#4a7c59] text-white shadow-lg scale-110"
                  : currentStep > step.num
                  ? "bg-[#4a7c59] text-white"
                  : "bg-gray-200 text-gray-500"
                }`}
            >
              {currentStep > step.num ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.num
              )}
            </div>
            <span
              className={`mt-1.5 text-xs font-medium whitespace-nowrap
                ${currentStep === step.num ? "text-[#4a7c59]" : currentStep > step.num ? "text-[#4a7c59]" : "text-gray-400"}`}
            >
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={`w-20 h-0.5 mx-2 mb-4 transition-all
                ${currentStep > step.num ? "bg-[#4a7c59]" : "bg-gray-200"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
