import { useState, useEffect } from "react";
import { CLASS_LIST, FEE_TYPES, PAYMENT_METHODS } from "../../../data/schoolConfig";
import { fetchFeeCollection, upsertFeeCollection } from "../../../lib/dailyReport";
import SummaryCard from "../shared/SummaryCard";

export default function FeeCollectionForm({ reportId }) {
  const [activeTab, setActiveTab] = useState(FEE_TYPES[0].key);
  const [allData, setAllData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!reportId) return;
    loadData();
  }, [reportId]);

  async function loadData() {
    const existing = await fetchFeeCollection(reportId);
    const map = {};
    FEE_TYPES.forEach((ft) => {
      map[ft.key] = CLASS_LIST.map((cls) => {
        const row = existing.find((r) => r.standard_class === cls && r.fee_type === ft.key);
        return {
          standard_class: cls,
          fee_type: ft.key,
          amount: row?.amount ?? 0,
          payment_method: row?.payment_method ?? "",
        };
      });
    });
    setAllData(map);
  }

  function updateRow(feeType, idx, field, value) {
    setAllData((prev) => ({
      ...prev,
      [feeType]: prev[feeType].map((r, i) =>
        i === idx ? { ...r, [field]: field === "amount" ? parseFloat(value) || 0 : value } : r
      ),
    }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    const allRows = Object.values(allData).flat().filter((r) => r.amount > 0 || r.payment_method);
    await upsertFeeCollection(reportId, allRows);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const currentRows = allData[activeTab] || [];
  const tabTotal = currentRows.reduce((s, r) => s + r.amount, 0);

  // Grand totals across all fee types
  const grandTotals = FEE_TYPES.map((ft) => ({
    ...ft,
    total: (allData[ft.key] || []).reduce((s, r) => s + r.amount, 0),
  }));
  const grandTotal = grandTotals.reduce((s, t) => s + t.total, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">Fee Collection</h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all"
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Save"}
        </button>
      </div>

      {/* Summary by fee type */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {grandTotals.map((ft) => (
          <SummaryCard
            key={ft.key}
            label={`${ft.abbr}`}
            value={`₹${ft.total.toLocaleString()}`}
            sub={ft.label}
            color={ft.total > 0 ? "green" : "blue"}
          />
        ))}
        <SummaryCard label="Grand Total" value={`₹${grandTotal.toLocaleString()}`} color="purple" />
      </div>

      {/* Fee type tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {FEE_TYPES.map((ft) => (
          <button
            key={ft.key}
            onClick={() => setActiveTab(ft.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === ft.key
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {ft.abbr} - {ft.label}
          </button>
        ))}
      </div>

      {/* Table for active tab */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Standard</th>
              <th className="text-center px-3 py-2.5 font-semibold text-gray-600">Amount (₹)</th>
              <th className="text-center px-3 py-2.5 font-semibold text-gray-600">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, idx) => (
              <tr key={row.standard_class} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-700">{row.standard_class}</td>
                <td className="px-1 py-1">
                  <input
                    type="number" min="0" step="0.01"
                    className="w-full text-center border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    value={row.amount}
                    onChange={(e) => updateRow(activeTab, idx, "amount", e.target.value)}
                  />
                </td>
                <td className="px-1 py-1">
                  <select
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    value={row.payment_method}
                    onChange={(e) => updateRow(activeTab, idx, "payment_method", e.target.value)}
                  >
                    <option value="">-- Select --</option>
                    {PAYMENT_METHODS.map((pm) => (
                      <option key={pm} value={pm}>{pm}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-300 bg-gray-50 font-bold">
              <td className="px-3 py-2">TOTAL</td>
              <td className="px-3 py-2 text-center">₹{tabTotal.toLocaleString()}</td>
              <td className="px-3 py-2"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Payment method summary */}
      {grandTotal > 0 && (
        <div>
          <h4 className="text-sm font-bold text-gray-600 mb-2">Payment Method Summary</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PAYMENT_METHODS.map((pm) => {
              const pmTotal = Object.values(allData).flat()
                .filter((r) => r.payment_method === pm)
                .reduce((s, r) => s + r.amount, 0);
              return (
                <div key={pm} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500">{pm}</p>
                  <p className="text-lg font-bold text-gray-700">₹{pmTotal.toLocaleString()}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
