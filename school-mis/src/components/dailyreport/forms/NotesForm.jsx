import { useState, useEffect } from "react";
import { updateReportNotes } from "../../../lib/dailyReport";

export default function NotesForm({ reportId, initialNotes }) {
  const [notes, setNotes] = useState(initialNotes || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setNotes(initialNotes || "");
  }, [initialNotes]);

  async function handleSave() {
    setSaving(true);
    await updateReportNotes(reportId, notes);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">Daily Notes</h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all"
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Save"}
        </button>
      </div>
      <textarea
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-y"
        placeholder="Notable events, issues, remarks for the day..."
        value={notes}
        onChange={(e) => { setNotes(e.target.value); setSaved(false); }}
      />
    </div>
  );
}
