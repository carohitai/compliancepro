import Select from "react-select";
import { BAC_SECTORS, NATURE_OF_BUSINESS } from "../../data/bacCodes";
import { CONSTITUTION_OPTIONS } from "../../data/newTaxAct";

const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? "#4a7c59" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(74,124,89,0.25)" : "none",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    minHeight: "40px",
    "&:hover": { borderColor: "#4a7c59" },
  }),
  option: (base, state) => ({
    ...base,
    fontSize: "0.8rem",
    backgroundColor: state.isSelected ? "#4a7c59" : state.isFocused ? "#f0f7f3" : "white",
    color: state.isSelected ? "white" : "#1f2937",
  }),
  groupHeading: (base) => ({
    ...base,
    fontSize: "0.7rem",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#6b7280",
    padding: "6px 12px 2px",
  }),
  placeholder: (base) => ({ ...base, color: "#9ca3af", fontSize: "0.875rem" }),
  menu: (base) => ({ ...base, zIndex: 50, borderRadius: "0.75rem", overflow: "hidden" }),
  menuList: (base) => ({ ...base, maxHeight: "260px" }),
};

export default function ClientPortalForm({ onNext }) {
  const [form, setForm] = React.useState({
    name: "", email: "", whatsapp: "", constitution: null, sector: null, nature: null,
  });
  const [errors, setErrors] = React.useState({});

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim())  e.name   = "Name is required";
    if (!form.email.trim()) e.email  = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.whatsapp.trim())  e.whatsapp  = "WhatsApp number is required";
    else if (!/^\d{10}$/.test(form.whatsapp.replace(/\s/g, ""))) e.whatsapp = "Enter a valid 10-digit WhatsApp number";
    if (!form.sector)  e.sector  = "Please select a business sector";
    if (!form.nature)  e.nature  = "Please select nature of business";
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onNext(form);
  }

  const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent transition";
  const lbl = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide";
  const err = "text-red-500 text-xs mt-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#4a7c59] text-white text-xs flex items-center justify-center font-bold">1</span>
          Client Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="md:col-span-2">
            <label className={lbl}>Full Name <span className="text-red-500">*</span></label>
            <input className={`${inp} ${errors.name ? "border-red-400" : ""}`} placeholder="Your full name" value={form.name} onChange={(e) => set("name", e.target.value)} />
            {errors.name && <p className={err}>{errors.name}</p>}
          </div>

          {/* Constitution */}
          <div className="md:col-span-2">
            <label className={lbl}>Constitution / Entity Type</label>
            <Select
              options={CONSTITUTION_OPTIONS}
              value={form.constitution}
              onChange={(v) => set("constitution", v)}
              placeholder="Search or select entity type (Individual, Pvt Ltd, LLP…)"
              styles={selectStyles}
              isSearchable
              isClearable
            />
            <p className="text-gray-400 text-xs mt-1">Helps tailor your compliance report to your entity type.</p>
          </div>

          {/* Email */}
          <div>
            <label className={lbl}>Email ID <span className="text-red-500">*</span></label>
            <input type="email" className={`${inp} ${errors.email ? "border-red-400" : ""}`} placeholder="email@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
            {errors.email && <p className={err}>{errors.email}</p>}
          </div>

          {/* WhatsApp */}
          <div>
            <label className={lbl}>WhatsApp Number <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <span className="flex items-center px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500 font-medium select-none">🇮🇳 +91</span>
              <input type="tel" maxLength={10} className={`${inp} flex-1 ${errors.whatsapp ? "border-red-400" : ""}`} placeholder="10-digit WhatsApp number" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value.replace(/\D/g, ""))} />
            </div>
            {errors.whatsapp && <p className={err}>{errors.whatsapp}</p>}
          </div>

          {/* BAC Sector */}
          <div className="md:col-span-2">
            <label className={lbl}>Business Sector (BAC Code) <span className="text-red-500">*</span></label>
            <Select
              options={BAC_SECTORS}
              value={form.sector}
              onChange={(v) => set("sector", v)}
              placeholder="Search or select your business sector..."
              styles={selectStyles}
              isSearchable
              className={errors.sector ? "ring-1 ring-red-400 rounded-lg" : ""}
            />
            {errors.sector && <p className={err}>{errors.sector}</p>}
          </div>

          {/* Nature of business */}
          <div className="md:col-span-2">
            <label className={lbl}>Nature of Business <span className="text-red-500">*</span></label>
            <Select
              options={NATURE_OF_BUSINESS}
              value={form.nature}
              onChange={(v) => set("nature", v)}
              placeholder="Search or select nature of business..."
              styles={selectStyles}
              isSearchable
              className={errors.nature ? "ring-1 ring-red-400 rounded-lg" : ""}
            />
            {errors.nature && <p className={err}>{errors.nature}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="bg-[#4a7c59] hover:bg-[#3d6b4a] text-white font-semibold px-8 py-3 rounded-xl shadow-sm transition-all flex items-center gap-2">
          Next: Choose Report Type
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}

// Need React in scope for useState
import React from "react";
