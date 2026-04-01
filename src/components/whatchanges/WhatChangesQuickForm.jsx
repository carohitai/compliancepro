import { useState } from "react";
import { NATURE_OF_BUSINESS } from "../../data/bacCodes";

export default function WhatChangesQuickForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [nature, setNature] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const selectedNature = NATURE_OF_BUSINESS.find((n) => n.value === nature) || null;
    onSubmit({ name: name.trim() || "Taxpayer", nature: selectedNature });
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a3a6b] to-[#2a5298] rounded-2xl p-6 mb-8 text-white text-center">
        <div className="flex justify-center gap-1 mb-3">
          {["K", "&", "A"].map((ch, i) => (
            <div key={i} className="w-9 h-10 bg-[#8ab45a] flex items-center justify-center rounded-sm shadow-sm">
              <span className="text-[#1a3a6b] font-serif font-bold text-base">{ch}</span>
            </div>
          ))}
        </div>
        <h2 className="text-xl font-bold mb-1">What Changes For Me?</h2>
        <p className="text-blue-200 text-sm">New Income Tax Act 2025 — personalised report</p>
        <p className="text-blue-300 text-xs mt-1">Effective from Tax Year 2026-27</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Your Name <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rahul Shah / ABC Pvt Ltd"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/30 focus:border-[#1a3a6b]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Nature of Business / Profession <span className="text-red-500">*</span>
          </label>
          <select
            value={nature}
            onChange={(e) => setNature(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/30 focus:border-[#1a3a6b] bg-white"
          >
            <option value="">— Select your business type —</option>
            {NATURE_OF_BUSINESS.map((n) => (
              <option key={n.value} value={n.value}>{n.label}</option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1.5">This helps us highlight changes most relevant to you.</p>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#1a3a6b] hover:bg-[#0f2548] text-white font-bold rounded-xl transition-all text-sm shadow-sm hover:shadow-md"
        >
          Generate My Report →
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-4">
        Based on Income Tax Bill, 2025 · incometaxindia.gov.in
      </p>
    </div>
  );
}
