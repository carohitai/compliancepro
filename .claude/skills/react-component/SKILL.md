---
name: react-component
description: Generate React components following CompliancePro patterns. Use when the user asks to create a new React component, page, form, or UI element.
---

# React Component Generator

Create React components following CompliancePro conventions.

## Template

```jsx
import { useState } from "react";

export default function ComponentName({ onBack, clientInfo }) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2548] via-[#1a3a6b] to-[#1a3a6b] p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center gap-3 mb-6">
          {onBack && (
            <button onClick={onBack} className="text-blue-300 hover:text-white transition-colors">
              ← Back
            </button>
          )}
          <h1 className="text-2xl font-bold text-white">Page Title</h1>
        </div>

        {/* Card container */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          {/* Content */}
        </div>
      </div>
    </div>
  );
}
```

## Key Conventions

1. **Functional components only** — no class components
2. **PascalCase filenames** — `ClientInfoForm.jsx`, `HomeScreen.jsx`
3. **Default export** for the main component per file
4. **Tailwind only** — no CSS modules, no styled-components
5. **State:** `useState` / `useEffect` only — no Redux, no Zustand
6. **JSX, not TSX** — no TypeScript in frontend components
7. **Props:** Destructure in function signature
8. **Environment vars:** `import.meta.env.VITE_*`

## Design System (Tailwind classes)

### Colors
- **Background:** `bg-gradient-to-br from-[#0f2548] via-[#1a3a6b] to-[#1a3a6b]`
- **Cards:** `bg-white/5 border border-white/10 rounded-2xl`
- **Accent green:** `text-[#8ab45a]`, `bg-[#8ab45a]`
- **Text primary:** `text-white`
- **Text secondary:** `text-blue-300`

### Common Components
- **Primary button:** `bg-[#8ab45a] hover:bg-[#7aa34e] text-white font-semibold py-3 px-6 rounded-xl transition-colors`
- **Input field:** `bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-300/50 focus:border-[#8ab45a] focus:outline-none`
- **Card hover:** `hover:bg-white/10 hover:border-[#8ab45a]/60 hover:shadow-xl hover:scale-[1.02] transition-all`

## File Placement

- Portal pages: `src/components/portal/`
- Compliance pages: `src/components/compliance/`
- Requirement pages: `src/components/requirement/`
- What Changes pages: `src/components/whatchanges/`
- Dashboard pages: `src/components/dashboard/`
- Shared/top-level: `src/components/`

## Routing

Hash-based routing in `App.jsx` — add new routes there:

```jsx
case "new-page":
  return <NewPage onBack={() => setMode("home")} />;
```

## API Integration Pattern

```jsx
import { saveToAirtable, isAirtableEnabled } from "../lib/airtable";

const handleSubmit = async () => {
  setLoading(true);
  if (isAirtableEnabled) {
    const { id, error } = await saveToAirtable(fields);
    if (error) console.error("Save failed:", error);
  }
  setLoading(false);
};
```
