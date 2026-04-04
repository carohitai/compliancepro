import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CLASS_LIST } from "../../../data/schoolConfig";
import {
  fetchEnquiries, addEnquiry, updateEnquiry, deleteEnquiry,
  fetchEnquirySummary, fetchEnquiryMonthly,
} from "../../../lib/dailyReport";
import SummaryCard from "../shared/SummaryCard";

const EMPTY_ENQUIRY = {
  parent_name: "", contact_number: "", enquiry_for_class: CLASS_LIST[0], converted: false, notes: "",
};

export default function EnquiriesForm({ reportId }) {
  const [enquiries, setEnquiries] = useState([]);
  const [form, setForm] = useState({ ...EMPTY_ENQUIRY });
  const [summary, setSummary] = useState({ total: 0, converted: 0, notConverted: 0 });
  const [monthlyData, setMonthlyData] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!reportId) return;
    loadAll();
  }, [reportId]);

  async function loadAll() {
    const [enqs, sum, monthly] = await Promise.all([
      fetchEnquiries(reportId),
      fetchEnquirySummary(),
      fetchEnquiryMonthly(),
    ]);
    setEnquiries(enqs);
    setSummary(sum);
    setMonthlyData(monthly.map((m) => ({
      month: m.month,
      Converted: m.converted,
      "Not Converted": m.not_converted,
    })));
  }

  async function handleAdd() {
    if (!form.parent_name.trim()) return;
    setSaving(true);
    await addEnquiry(reportId, form);
    setForm({ ...EMPTY_ENQUIRY });
    await loadAll();
    setSaving(false);
  }

  async function toggleConverted(enq) {
    await updateEnquiry(enq.id, { converted: !enq.converted });
    await loadAll();
  }

  async function handleDelete(id) {
    await deleteEnquiry(id);
    await loadAll();
  }

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-gray-800">Enquiries</h3>

      {/* Summary dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard label="Total Till Date" value={summary.total} color="blue" />
        <SummaryCard label="Today" value={enquiries.length} color="purple" />
        <SummaryCard label="Converted" value={summary.converted} color="green" />
        <SummaryCard label="Not Converted" value={summary.notConverted} color="red" />
      </div>

      {/* Add new enquiry form */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <h4 className="text-sm font-bold text-gray-600">Add New Enquiry</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Parent/Guardian Name</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
              placeholder="Name"
              value={form.parent_name}
              onChange={(e) => setForm({ ...form, parent_name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Contact Number</label>
            <input
              type="tel"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
              placeholder="Phone number"
              value={form.contact_number}
              onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Enquiry For Class</label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
              value={form.enquiry_for_class}
              onChange={(e) => setForm({ ...form, enquiry_for_class: e.target.value })}
            >
              {CLASS_LIST.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Converted?</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-1.5 text-sm">
                <input
                  type="radio" name="converted" checked={!form.converted}
                  onChange={() => setForm({ ...form, converted: false })}
                  className="accent-indigo-600"
                />
                No
              </label>
              <label className="flex items-center gap-1.5 text-sm">
                <input
                  type="radio" name="converted" checked={form.converted}
                  onChange={() => setForm({ ...form, converted: true })}
                  className="accent-indigo-600"
                />
                Yes
              </label>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Notes</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
            placeholder="Optional notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={saving || !form.parent_name.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all"
        >
          {saving ? "Adding..." : "Add Enquiry"}
        </button>
      </div>

      {/* Today's enquiries list */}
      {enquiries.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-3 py-2 font-semibold text-gray-600">Parent</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-600">Contact</th>
                <th className="text-center px-3 py-2 font-semibold text-gray-600">Class</th>
                <th className="text-center px-3 py-2 font-semibold text-gray-600">Converted</th>
                <th className="text-center px-3 py-2 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enq) => (
                <tr key={enq.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-700">{enq.parent_name}</td>
                  <td className="px-3 py-2 text-gray-600">{enq.contact_number}</td>
                  <td className="px-3 py-2 text-center">{enq.enquiry_for_class}</td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => toggleConverted(enq)}
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        enq.converted
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {enq.converted ? "Yes" : "No"}
                    </button>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => handleDelete(enq.id)}
                      className="text-red-400 hover:text-red-600 text-xs"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Monthly trend chart */}
      {monthlyData.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-gray-600 mb-2">Monthly Enquiry Trend</h4>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Converted" fill="#22c55e" stackId="a" />
                <Bar dataKey="Not Converted" fill="#ef4444" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
