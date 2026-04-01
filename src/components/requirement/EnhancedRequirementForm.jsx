import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Select from "react-select";
import { LOAN_TYPES, BANK_RATES, LOAN_DISCLAIMER } from "../../data/bankRates";
import { ALL_REQUIREMENTS, ASSIGNMENTS } from "../../data/requirements";
import EnhancedRequirementReport from "./EnhancedRequirementReport";

const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? "#4a7c59" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(74,124,89,0.25)" : "none",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    "&:hover": { borderColor: "#4a7c59" },
  }),
  option: (base, state) => ({
    ...base,
    fontSize: "0.8rem",
    backgroundColor: state.isSelected ? "#4a7c59" : state.isFocused ? "#f0f7f3" : "white",
    color: state.isSelected ? "white" : "#1f2937",
  }),
  menu: (base) => ({ ...base, zIndex: 50, borderRadius: "0.75rem", overflow: "hidden" }),
};

const PURPOSE_OPTIONS = [
  { value: "accounting",    label: "📒 Accounting / Bookkeeping" },
  { value: "gst_returns",   label: "🏷️ GST Returns" },
  { value: "tax_audit",     label: "🔍 Tax Audit (Sec. 44AB)" },
  { value: "itr",           label: "📄 Income Tax Return Filing" },
  { value: "tds",           label: "💰 TDS Compliance" },
  { value: "gst_audit",     label: "📋 GST Audit (GSTR-9/9C)" },
  { value: "loan",          label: "🏗️ Loan Application" },
];

const FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
};

const purposeToAssignment = {
  accounting: "accounting",
  gst_returns: "gst",
  tax_audit: "it_audit",
  itr: "itr",
  tds: "tds",
  gst_audit: "gst_audit",
  loan: "project_finance",
};

export default function EnhancedRequirementForm({ clientInfo, onBack, onReset }) {
  const [files, setFiles] = useState([]);
  const [purpose, setPurpose] = useState(null);
  const [loanType, setLoanType] = useState(null);
  const [generated, setGenerated] = useState(false);

  const onDrop = useCallback((accepted) => {
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name));
      return [...prev, ...accepted.filter((f) => !existing.has(f.name))];
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: FILE_TYPES,
    maxSize: 20 * 1024 * 1024,
  });

  function removeFile(name) { setFiles((f) => f.filter((x) => x.name !== name)); }

  const isLoan = purpose?.value === "loan";

  function handleGenerate() {
    if (!purpose) return;
    setGenerated(true);
  }

  if (generated) {
    return (
      <EnhancedRequirementReport
        clientInfo={clientInfo}
        purpose={purpose}
        loanType={loanType}
        files={files}
        onBack={() => setGenerated(false)}
        onReset={onReset}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Client pill */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-gray-800">{clientInfo.name}</span>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-600">{clientInfo.sector?.label}</span>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-600">{clientInfo.nature?.label}</span>
        </div>
      </div>

      {/* Step A – File upload */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-base font-bold text-gray-800 mb-1 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#4a7c59] text-white text-xs flex items-center justify-center font-bold">A</span>
          Upload Documents <span className="text-xs font-normal text-gray-500 ml-1">(Optional)</span>
        </h3>
        <p className="text-xs text-gray-500 mb-4 ml-8">Upload existing documents (tax audit report, computation, ITR, etc.) to help curate the checklist</p>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${isDragActive ? "border-[#4a7c59] bg-green-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}
        >
          <input {...getInputProps()} />
          <div className="text-3xl mb-2">📁</div>
          <p className="text-sm font-semibold text-gray-700 mb-1">
            {isDragActive ? "Drop files here…" : "Drag & drop files here, or click to browse"}
          </p>
          <p className="text-xs text-gray-400">Accepts PDF, Excel (.xls/.xlsx), Word (.doc/.docx) · Max 20 MB per file</p>
        </div>

        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((f) => {
              const ext = f.name.split(".").pop().toLowerCase();
              const icon = ext === "pdf" ? "📄" : ext.startsWith("xls") ? "📊" : "📝";
              return (
                <div key={f.name} className="flex items-center justify-between gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                  <div className="flex items-center gap-2 min-w-0">
                    <span>{icon}</span>
                    <span className="text-sm font-medium text-gray-700 truncate">{f.name}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">({(f.size / 1024).toFixed(0)} KB)</span>
                  </div>
                  <button onClick={() => removeFile(f.name)} className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Step B – Purpose */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-base font-bold text-gray-800 mb-1 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#4a7c59] text-white text-xs flex items-center justify-center font-bold">B</span>
          Purpose of Checklist <span className="text-red-500 text-sm ml-0.5">*</span>
        </h3>
        <p className="text-xs text-gray-500 mb-4 ml-8">Select what this requirement checklist will be used for</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {PURPOSE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { setPurpose(opt); setLoanType(null); }}
              className={`text-left p-3 rounded-xl border-2 transition-all text-sm font-semibold
                ${purpose?.value === opt.value
                  ? "border-[#4a7c59] bg-green-50 text-[#4a7c59]"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Loan type sub-selection */}
        {isLoan && (
          <div className="mt-2 p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-3">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Type of Loan <span className="text-red-500">*</span>
            </label>
            <Select
              options={LOAN_TYPES}
              value={loanType}
              onChange={setLoanType}
              placeholder="Search and select loan type..."
              styles={selectStyles}
              isSearchable
            />
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button
          disabled={!purpose || (isLoan && !loanType)}
          onClick={handleGenerate}
          className="bg-[#4a7c59] hover:bg-[#3d6b4a] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-xl shadow-sm flex items-center gap-2"
        >
          Generate Requirement Report
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
