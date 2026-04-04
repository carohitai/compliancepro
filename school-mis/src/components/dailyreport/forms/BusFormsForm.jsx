import { useState, useEffect } from "react";
import { VEHICLE_LIST } from "../../../data/schoolConfig";
import { fetchBusForms, upsertBusForms, fetchBusCumulative } from "../../../lib/dailyReport";
import SummaryCard from "../shared/SummaryCard";

export default function BusFormsForm({ reportId }) {
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
      fetchBusForms(reportId),
      fetchBusCumulative(),
    ]);
    setCumulative(cum);
    setRows(
      VEHICLE_LIST.map((v) => {
        const row = existing.find((r) => r.bus_number === v.bus_number);
        return {
          bus_number: v.bus_number,
          forms_filled: row?.forms_filled ?? 0,
          bus_fees_collected: row?.bus_fees_collected ?? 0,
        };
      })
    );
  }

  function updateRow(idx, field, value) {
    setRows((prev) =>
      prev.map((r, i) =>
        i === idx
          ? { ...r, [field]: field === "bus_fees_collected" ? parseFloat(value) || 0 : parseInt(value) || 0 }
          : r
      )
    );
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    await upsertBusForms(reportId, rows);
    const cum = await fetchBusCumulative();
    setCumulative(cum);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function getCum(busNumber) {
    return cumulative.find((c) => c.bus_number === busNumber) || {};
  }

  const todayTotals = rows.reduce(
    (acc, r) => ({
      forms: acc.forms + r.forms_filled,
      fees: acc.fees + r.bus_fees_collected,
    }),
    { forms: 0, fees: 0 }
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">School Bus</h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all"
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Save"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SummaryCard label="Forms Today" value={todayTotals.forms} color="blue" />
        <SummaryCard label="Fees Today" value={`₹${todayTotals.fees.toLocaleString()}`} color="green" />
      </div>

      {/* Daily entry */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Bus No.</th>
              <th className="text-center px-3 py-2.5 font-semibold text-gray-600">Forms Today</th>
              <th className="text-center px-3 py-2.5 font-semibold text-gray-600">Fees Collected (₹)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.bus_number} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-700">{row.bus_number}</td>
                <td className="px-1 py-1">
                  <input
                    type="number" min="0"
                    className="w-full text-center border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    value={row.forms_filled}
                    onChange={(e) => updateRow(idx, "forms_filled", e.target.value)}
                  />
                </td>
                <td className="px-1 py-1">
                  <input
                    type="number" min="0" step="0.01"
                    className="w-full text-center border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    value={row.bus_fees_collected}
                    onChange={(e) => updateRow(idx, "bus_fees_collected", e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-300 bg-gray-50 font-bold">
              <td className="px-3 py-2">TOTAL</td>
              <td className="px-3 py-2 text-center">{todayTotals.forms}</td>
              <td className="px-3 py-2 text-center">₹{todayTotals.fees.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Progressive summary */}
      {cumulative.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-gray-600 mb-2">Progressive Summary (All Time)</h4>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="text-left px-3 py-2 font-semibold text-blue-700">Bus No.</th>
                  <th className="text-center px-3 py-2 font-semibold text-blue-700">Total Forms</th>
                  <th className="text-center px-3 py-2 font-semibold text-blue-700">Today's Forms</th>
                  <th className="text-center px-3 py-2 font-semibold text-blue-700">Total Students</th>
                  <th className="text-center px-3 py-2 font-semibold text-blue-700">Total Fees</th>
                </tr>
              </thead>
              <tbody>
                {VEHICLE_LIST.map((v) => {
                  const c = getCum(v.bus_number);
                  const today = rows.find((r) => r.bus_number === v.bus_number);
                  return (
                    <tr key={v.bus_number} className="border-t border-blue-100">
                      <td className="px-3 py-1.5 font-medium text-gray-700">{v.bus_number}</td>
                      <td className="px-3 py-1.5 text-center">{c.total_forms_filled || 0}</td>
                      <td className="px-3 py-1.5 text-center">{today?.forms_filled || 0}</td>
                      <td className="px-3 py-1.5 text-center font-semibold">{c.total_forms_filled || 0}</td>
                      <td className="px-3 py-1.5 text-center">₹{(c.total_fees_collected || 0).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-blue-300 bg-blue-50 font-bold">
                  <td className="px-3 py-2">TOTAL</td>
                  <td className="px-3 py-2 text-center">{cumulative.reduce((s, c) => s + (c.total_forms_filled || 0), 0)}</td>
                  <td className="px-3 py-2 text-center">{todayTotals.forms}</td>
                  <td className="px-3 py-2 text-center">{cumulative.reduce((s, c) => s + (c.total_forms_filled || 0), 0)}</td>
                  <td className="px-3 py-2 text-center">₹{cumulative.reduce((s, c) => s + (c.total_fees_collected || 0), 0).toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
