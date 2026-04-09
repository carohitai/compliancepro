---
name: pdf-template
description: Generate PDF report templates using jsPDF + html2canvas following CompliancePro's DOM-to-canvas approach. Use when the user wants to create a new downloadable PDF report.
---

# PDF Report Template Generator

Generate PDF reports using jsPDF + html2canvas, following CompliancePro's DOM-to-canvas approach (render hidden HTML template, capture each page as a canvas, assemble into PDF).

## Architecture

1. **Hidden HTML template** — rendered off-screen in the component tree
2. **html2canvas** — captures each page div as a canvas element
3. **jsPDF** — assembles canvas images into a multi-page A4 PDF
4. **Generator function** — orchestrates capture and triggers download or returns blob

## Hidden Template Pattern

Add a hidden wrapper div inside your component's JSX:

```jsx
{/* Hidden PDF template — rendered off-screen, captured by html2canvas */}
<div
  id="my-pdf-template"
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "794px",       /* A4 width at 96 DPI */
    zIndex: -9999,
    opacity: 0,
    pointerEvents: "none",
  }}
>
  {/* Page 1 */}
  <div id="my-page-cover" style={{ width: "794px", minHeight: "1123px", background: "#fff", padding: "48px" }}>
    <h1>Report Title</h1>
    {/* Cover page content */}
  </div>

  {/* Page 2 */}
  <div id="my-page-content" style={{ width: "794px", minHeight: "1123px", background: "#fff", padding: "48px" }}>
    {/* Body content */}
  </div>
</div>
```

### Key dimensions
- **A4 at 96 DPI:** 794px x 1123px
- Each page div should have `width: "794px"` and `minHeight: "1123px"`
- Use inline styles (not Tailwind) for the PDF template — html2canvas captures computed styles

## Generator Function Pattern

Create a generator in `src/lib/generate<Name>Pdf.js`:

```javascript
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/** Build safe filename from client name + date. */
function buildFilename(clientName) {
  const safeName = (clientName || "Report")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "_");
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `KA_ReportName_${safeName}_${dateStr}.pdf`;
}

/** Capture all page divs and assemble into jsPDF instance. */
async function capturePdf(clientName) {
  const wrapper = document.getElementById("my-pdf-template");
  if (!wrapper) throw new Error("PDF template not found");

  // Make visible for capture
  wrapper.style.opacity = "1";
  wrapper.style.pointerEvents = "none";
  await new Promise((r) => setTimeout(r, 120));

  const PAGE_IDS = ["my-page-cover", "my-page-content"];

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  let firstPage = true;

  for (const id of PAGE_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 794,
    });

    if (!firstPage) pdf.addPage();
    firstPage = false;

    const imgData = canvas.toDataURL("image/png");
    const canvasW = canvas.width;
    const canvasH = canvas.height;

    let imgW = pageW;
    let imgH = (canvasH / canvasW) * pageW;
    if (imgH > pageH) {
      const scale = pageH / imgH;
      imgW *= scale;
      imgH = pageH;
    }

    pdf.addImage(imgData, "PNG", 0, 0, imgW, imgH);
  }

  // Hide again
  wrapper.style.opacity = "0";
  wrapper.style.pointerEvents = "none";

  return { pdf, filename: buildFilename(clientName) };
}

/** Download PDF to user's device. */
export async function generateReportPdf(clientName) {
  const { pdf, filename } = await capturePdf(clientName);
  pdf.save(filename);
}

/** Return PDF as Blob (for upload/sharing). */
export async function buildPdfBlob(clientName) {
  const { pdf, filename } = await capturePdf(clientName);
  return { blob: pdf.output("blob"), filename };
}
```

## Calling from a Component

```jsx
import { generateReportPdf } from "../lib/generateReportPdf";

const handleDownload = async () => {
  setDownloading(true);
  try {
    await generateReportPdf(clientInfo?.name);
  } catch (err) {
    console.error("PDF generation failed:", err);
  }
  setDownloading(false);
};
```

## Key Rules

1. **Use inline styles** for PDF template divs — Tailwind classes may not be captured correctly by html2canvas
2. **Fixed width 794px** — ensures consistent A4 rendering across devices
3. **120ms delay** before capture — allows browser to render template
4. **scale: 2** in html2canvas — produces crisp output on retina displays
5. **Each page is a separate div** — avoids content being cut mid-element
6. **Hide/show wrapper** — set `opacity: 0` normally, `opacity: 1` during capture
7. **Filename convention:** `KA_<ReportType>_<ClientName>_<YYYYMMDD>.pdf`

## File Placement

- Generator functions: `src/lib/generate<Name>Pdf.js`
- Hidden templates: inside the component that triggers the download

## Existing Reference

- `src/lib/generateWhatChangesPdf.js` — full working example
- `src/lib/uploadPdf.js` — uploading generated PDFs for sharing
