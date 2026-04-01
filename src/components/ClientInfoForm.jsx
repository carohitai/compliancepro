import { useState } from "react";
import { CONSTITUTIONS, REGISTRATION_TYPES } from "../data/requirements";

export default function ClientInfoForm({ onNext }) {
  const [form, setForm] = useState({
    name: "",
    tradeName: "",
    constitution: "",
    address: "",
    email: "",
    phone: "",
    financialYear: "2024-25",
    registrations: {},
  });
  const [errors, setErrors] = useState({});

  const financialYears = [
    "2024-25", "2023-24", "2022-23", "2021-22", "2020-21",
  ];

  function handleField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  }

  function handleReg(key, field, value) {
    setForm((f) => ({
      ...f,
      registrations: {
        ...f.registrations,
        [key]: { ...(f.registrations[key] || { enabled: false, number: "" }), [field]: value },
      },
    }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Client name is required";
    if (!form.constitution) e.constitution = "Please select constitution";
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onNext(form);
  }

  const inputCls =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent transition";
  const labelCls = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#4a7c59] text-white text-xs flex items-center justify-center font-bold">1</span>
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Client Name <span className="text-red-500">*</span></label>
            <input
              className={`${inputCls} ${errors.name ? "border-red-400 ring-1 ring-red-300" : ""}`}
              placeholder="Full legal name"
              value={form.name}
              onChange={(e) => handleField("name", e.target.value)}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className={labelCls}>Trade / Brand Name</label>
            <input
              className={inputCls}
              placeholder="Trade / business name (if different)"
              value={form.tradeName}
              onChange={(e) => handleField("tradeName", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Constitution <span className="text-red-500">*</span></label>
            <select
              className={`${inputCls} bg-white ${errors.constitution ? "border-red-400 ring-1 ring-red-300" : ""}`}
              value={form.constitution}
              onChange={(e) => handleField("constitution", e.target.value)}
            >
              <option value="">— Select —</option>
              {CONSTITUTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.constitution && <p className="text-red-500 text-xs mt-1">{errors.constitution}</p>}
          </div>
          <div>
            <label className={labelCls}>Financial Year</label>
            <select
              className={`${inputCls} bg-white`}
              value={form.financialYear}
              onChange={(e) => handleField("financialYear", e.target.value)}
            >
              {financialYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Business Address</label>
            <input
              className={inputCls}
              placeholder="Registered / principal business address"
              value={form.address}
              onChange={(e) => handleField("address", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input
              type="email"
              className={inputCls}
              placeholder="contact@example.com"
              value={form.email}
              onChange={(e) => handleField("email", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input
              type="tel"
              className={inputCls}
              placeholder="+91 XXXXX XXXXX"
              value={form.phone}
              onChange={(e) => handleField("phone", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Registrations */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-base font-bold text-gray-800 mb-1 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#4a7c59] text-white text-xs flex items-center justify-center font-bold">2</span>
          Registrations Available
        </h3>
        <p className="text-xs text-gray-500 mb-4 ml-8">Check all that apply and enter the respective registration numbers</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REGISTRATION_TYPES.map(({ key, label, placeholder }) => {
            const reg = form.registrations[key] || { enabled: false, number: "" };
            return (
              <div
                key={key}
                className={`border rounded-xl p-3 transition-all ${
                  reg.enabled ? "border-[#4a7c59] bg-green-50" : "border-gray-200 bg-gray-50"
                }`}
              >
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-[#4a7c59] rounded"
                    checked={reg.enabled}
                    onChange={(e) => handleReg(key, "enabled", e.target.checked)}
                  />
                  <span className="text-sm font-semibold text-gray-700">{label}</span>
                </label>
                {reg.enabled && (
                  <input
                    className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent bg-white"
                    placeholder={placeholder}
                    value={reg.number}
                    onChange={(e) => handleReg(key, "number", e.target.value)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-[#4a7c59] hover:bg-[#3d6b4a] text-white font-semibold px-8 py-3 rounded-xl shadow-sm transition-all flex items-center gap-2"
        >
          Next: Select Assignments
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}
