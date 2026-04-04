import { useState, useEffect } from "react";
import { CLASS_LIST } from "../../../data/schoolConfig";
import { fetchAdmissions, upsertAdmissions, fetchAdmissionsCumulative } from "../../../lib/dailyReport";
import SummaryCard from "../shared/SummaryCard";

export default function AdmissionsForm({ reportId }) {
  const [rows, setRows] = useState([]);
  const [cumulative, setCumulative] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!reportId) return;
    loadData();
  }, [reportId]);

  async function loadData() {
    const [existing, cum] = await Promise.all([
      fetchAdmissions(reportId),
      fetchAdmissionsCumulative(),
    ]);
    setCumulative(cum);
    setRows(
      CLASS_LIST.map((cls) => {
        const row = existing.find((r) => r.standard_class === cls);
        return {
          standard_class: cls,
          new_admissions: row?.new_admissions ?? 0,
          finance_count: row?.finance_count ?? 0,
          one_time_count: row?.one_time_count ?? 0,
          amount_collected: row?.amount_collected ?? 0,
        };
      })
    );
  }

  function updateRow(idx, field, value) {
    setRows((prev) =>
      prev.map((r, i) => {
        if (i !== idx) return r;
        const updated = { ...r, [field]: field === "amount_collected" ? parseFloat(value) || 0 : parseInt(value) || 0 };
        if (field === "finance_count" || field === "one_time_count") {
          updated.new_admissions = updated.finance_count + updated.one_time_count;
        }
        return updated;
      })
    );
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    await upsertAdmissions(reportId, rows);
    const cum = await fetchAdmissionsCumulative();
    setCumulative(cum);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const todayTotals = rows.reduce(
    (acc, r) => ({
      admissions: acc.admissions + r.new_admissions,
      finance: acc.finance + r.finance_count,
      oneTime: acc.oneTime + r.one_time_count,
      amount: acc.amount + r.amount_collected,
    }),
    { admissions: 0, finance: 0, oneTime: 0, amount: 0 }
  );

  function getCumulative(cls) {
    return cumulative.find((c) => c.standard_class === cls) || {};
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">Admissions</h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all"
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Save"}
        </button>
      </div>

      {/* Today's summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard label="Today's Admissions" value={todayTotals.admissions} color="blue" />
        <SummaryCard label="Finance (EMI)" value={todayTotals.finance} color="amber" />
        <SummaryCard label="One-Time" value={todayTotals.oneTime} color="green" />
        <SummaryCard label="Amount Collected" value={`₹${todayTotals.amount.toLocaleString()}`} color="purple" />
      </div>

      {/* Daily entry table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Standard</th>
              <th className="text-center px-3 py-2.5 font-semibold text-gray-600">Finance</th>
              <th className="text-center px-3 py-2.5 font-semibold text-gray-600">One-Time</th>
              <th className="text-center px-3 py-2.5 font-semibold text-indigo-600">Total</th>
              <th className="text-center px-3 py-2.5 font-semibold text-gray-600">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.standard_class} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-700">{row.standard_class}</td>
                <td className="px-1 py-1">
                  <input
                    type="number" min="0"
                    className="w-full text-center border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    value={row.finance_count}
                    onChange={(e) => updateRow(idx, "finance_count", e.target.value)}
                  />
                </td>
                <td className="px-1 py-1">
                  <input
                    type="number" min="0"
                    className="w-full text-center border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    value={row.one_time_count}
                    onChange={(e) => updateRow(idx, "one_time_count", e.target.value)}
                  />
                </td>
                <td className="px-3 py-2 text-center font-bold text-indigo-600">{row.new_admissions}</td>
                <td className="px-1 py-1">
                  <input
                    type="number" min="0" step="0.01"
                    className="w-full text-center border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    value={row.amount_collected}
                    onChange={(e) => updateRow(idx, "amount_collected", e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-300 bg-gray-50 font-bold">
              <td className="px-3 py-2">TOTAL</td>
              <td className="px-3 py-2 text-center">{todayTotals.finance}</td>
              <td className="px-3 py-2 text-center">{todayTotals.oneTime}</td>
              <td className="px-3 py-2 text-center text-indigo-600">{todayTotals.admissions}</td>
              <td className="px-3 py-2 text-center">₹{todayTotals.amount.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Progressive totals */}
      {cumulative.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-gray-600 mb-2">Progressive Totals (All Time)</h4>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="text-left px-3 py-2 font-semibold text-blue-700">Standard</th>
                  <th className="text-center px-3 py-2 font-semibold text-blue-700">Total Admissions</th>
                  <th className="text-center px-3 py-2 font-semibold text-blue-700">Finance</th>
                  <th className="text-center px-3 py-2 font-semibold text-blue-700">One-Time</th>
                </tr>
              </thead>
              <tbody>
                {CLASS_LIST.map((cls) => {
                  const c = getCumulative(cls);
                  return (
                    <tr key={cls} className="border-t border-blue-100">
                      <td className="px-3 py-1.5 font-medium text-gray-700">{cls}</td>
                      <td className="px-3 py-1.5 text-center">{c.total_admissions || 0}</td>
                      <td className="px-3 py-1.5 text-center">{c.total_finance || 0}</td>
                      <td className="px-3 py-1.5 text-center">{c.total_one_time || 0}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-blue-300 bg-blue-50 font-bold">
                  <td className="px-3 py-2">TOTAL</td>
                  <td className="px-3 py-2 text-center">{cumulative.reduce((s, c) => s + (c.total_admissions || 0), 0)}</td>
                  <td className="px-3 py-2 text-center">{cumulative.reduce((s, c) => s + (c.total_finance || 0), 0)}</td>
                  <td className="px-3 py-2 text-center">{cumulative.reduce((s, c) => s + (c.total_one_time || 0), 0)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
