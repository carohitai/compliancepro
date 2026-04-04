import { useState, useEffect } from "react";
import { fetchStaffAttendance, upsertStaffAttendance } from "../../../lib/dailyReport";
import SummaryCard from "../shared/SummaryCard";

export default function StaffAttendanceForm({ reportId }) {
  const [data, setData] = useState({ total_staff: 0, present: 0, on_leave: 0 });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!reportId) return;
    loadData();
  }, [reportId]);

  async function loadData() {
    const existing = await fetchStaffAttendance(reportId);
    if (existing) {
      setData({
        total_staff: existing.total_staff || 0,
        present: existing.present || 0,
        on_leave: existing.on_leave || 0,
      });
    }
  }

  function update(field, value) {
    setData((prev) => ({ ...prev, [field]: parseInt(value) || 0 }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    await upsertStaffAttendance(reportId, data);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const absent = Math.max(0, data.total_staff - data.present - data.on_leave);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">Staff Attendance</h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all"
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Save"}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard label="Total Staff" value={data.total_staff} color="blue" />
        <SummaryCard label="Present" value={data.present} color="green" />
        <SummaryCard label="On Leave" value={data.on_leave} color="amber" />
        <SummaryCard label="Absent" value={absent} color="red" />
      </div>

      <div className="bg-gray-50 rounded-xl p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Total Staff</label>
            <input
              type="number" min="0"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-indigo-400"
              value={data.total_staff}
              onChange={(e) => update("total_staff", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Present</label>
            <input
              type="number" min="0"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-indigo-400"
              value={data.present}
              onChange={(e) => update("present", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">On Leave</label>
            <input
              type="number" min="0"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-indigo-400"
              value={data.on_leave}
              onChange={(e) => update("on_leave", e.target.value)}
            />
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Absent = Total Staff - Present - On Leave = <strong>{absent}</strong> (auto-calculated)
        </p>
      </div>
    </div>
  );
}
