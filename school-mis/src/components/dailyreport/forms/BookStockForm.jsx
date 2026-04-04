import { useState, useEffect } from "react";
import { CLASS_LIST } from "../../../data/schoolConfig";
import { fetchBookStock, upsertBookStock, fetchPreviousDayClosingStock } from "../../../lib/dailyReport";

export default function BookStockForm({ reportId, reportDate }) {
  const [rows, setRows] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!reportId) return;
    loadData();
  }, [reportId, reportDate]);

  async function loadData() {
    const existing = await fetchBookStock(reportId);
    const prevClosing = await fetchPreviousDayClosingStock(reportDate);

    if (existing.length > 0) {
      setRows(
        CLASS_LIST.map((cls) => {
          const row = existing.find((r) => r.standard_class === cls);
          return {
            standard_class: cls,
            opening_stock: row?.opening_stock ?? prevClosing[cls] ?? 0,
            purchased: row?.purchased ?? 0,
            sold: row?.sold ?? 0,
          };
        })
      );
    } else {
      setRows(
        CLASS_LIST.map((cls) => ({
          standard_class: cls,
          opening_stock: prevClosing[cls] ?? 0,
          purchased: 0,
          sold: 0,
        }))
      );
    }
  }

  function updateRow(idx, field, value) {
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [field]: parseInt(value) || 0 } : r))
    );
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    await upsertBookStock(reportId, rows);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const totals = rows.reduce(
    (acc, r) => ({
      opening: acc.opening + r.opening_stock,
      purchased: acc.purchased + r.purchased,
      sold: acc.sold + r.sold,
      closing: acc.closing + (r.opening_stock + r.purchased - r.sold),
    }),
    { opening: 0, purchased: 0, sold: 0, closing: 0 }
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">Book Stock & Sales</h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all"
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Save"}
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Standard</th>
              <th className="text-center px-3 py-2.5 font-semibold text-gray-600">Opening</th>
              <th className="text-center px-3 py-2.5 font-semibold text-gray-600">Purchased</th>
              <th className="text-center px-3 py-2.5 font-semibold text-gray-600">Sold</th>
              <th className="text-center px-3 py-2.5 font-semibold text-indigo-600">Closing</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.standard_class} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-700">{row.standard_class}</td>
                <td className="px-1 py-1">
                  <input
                    type="number"
                    min="0"
                    className="w-full text-center border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    value={row.opening_stock}
                    onChange={(e) => updateRow(idx, "opening_stock", e.target.value)}
                  />
                </td>
                <td className="px-1 py-1">
                  <input
                    type="number"
                    min="0"
                    className="w-full text-center border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    value={row.purchased}
                    onChange={(e) => updateRow(idx, "purchased", e.target.value)}
                  />
                </td>
                <td className="px-1 py-1">
                  <input
                    type="number"
                    min="0"
                    className="w-full text-center border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    value={row.sold}
                    onChange={(e) => updateRow(idx, "sold", e.target.value)}
                  />
                </td>
                <td className="px-3 py-2 text-center font-bold text-indigo-600">
                  {row.opening_stock + row.purchased - row.sold}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-300 bg-gray-50 font-bold">
              <td className="px-3 py-2 text-gray-700">TOTAL</td>
              <td className="px-3 py-2 text-center text-gray-700">{totals.opening}</td>
              <td className="px-3 py-2 text-center text-gray-700">{totals.purchased}</td>
              <td className="px-3 py-2 text-center text-gray-700">{totals.sold}</td>
              <td className="px-3 py-2 text-center text-indigo-600">{totals.closing}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="text-xs text-gray-400">
        Opening stock is auto-carried from previous day's closing. Closing = Opening + Purchased - Sold.
      </p>
    </div>
  );
}
