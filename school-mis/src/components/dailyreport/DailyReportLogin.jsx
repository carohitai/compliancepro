import { useState } from "react";

const PASSWORDS = {
  admin: import.meta.env.VITE_ADMIN_PASSWORD || "admin123",
  accounting: import.meta.env.VITE_ACCOUNTING_PASSWORD || "accounts123",
  librarian: import.meta.env.VITE_LIBRARIAN_PASSWORD || "library123",
};

const ROLES = [
  { key: "admin", label: "Admin", icon: "🏫", desc: "Admissions, Enquiries, Bus, Attendance" },
  { key: "accounting", label: "Accounting", icon: "📊", desc: "Fee Collection, Bus Fees" },
  { key: "librarian", label: "Librarian", icon: "📚", desc: "Book Stock & Sales" },
];

export default function DailyReportLogin({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!selectedRole) { setError("Please select a role"); return; }
    if (password === PASSWORDS[selectedRole]) {
      sessionStorage.setItem("smis_role", selectedRole);
      sessionStorage.setItem("smis_auth", "1");
      onLogin(selectedRole);
    } else {
      setError("Incorrect password. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-3">
            <span className="text-3xl">🏫</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">School MIS</h1>
          <p className="text-sm text-gray-500 mt-1">Daily Report System</p>
        </div>

        {/* Role selection */}
        <div className="space-y-2 mb-6">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Select Your Role</label>
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map((role) => (
              <button
                key={role.key}
                type="button"
                onClick={() => { setSelectedRole(role.key); setError(""); }}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  selectedRole === role.key
                    ? "border-indigo-500 bg-indigo-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="text-2xl block">{role.icon}</span>
                <span className="text-xs font-semibold block mt-1">{role.label}</span>
              </button>
            ))}
          </div>
          {selectedRole && (
            <p className="text-xs text-indigo-600 text-center mt-1">
              {ROLES.find((r) => r.key === selectedRole)?.desc}
            </p>
          )}
        </div>

        {/* Password */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your role password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition-all"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
