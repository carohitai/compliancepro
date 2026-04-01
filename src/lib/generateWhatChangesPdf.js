import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Captures each named page div independently — no slicing, no content cuts.
 * Each page div becomes exactly one PDF page, scaled to fit A4 if taller.
 */
export async function generateWhatChangesPdf(clientName) {
  const wrapper = document.getElementById("wcm-pdf-template");
  if (!wrapper) throw new Error("PDF template not found");

  // Reveal template off-screen for capture
  wrapper.style.opacity = "1";
  wrapper.style.pointerEvents = "none";

  // Small delay so browser renders the newly visible content
  await new Promise((r) => setTimeout(r, 120));

  const PAGE_IDS = [
    "wcm-page-cover",
    "wcm-page-nomenclature",
    "wcm-page-operations",
    "wcm-page-rates",
    "wcm-page-tds",
    "wcm-page-unchanged",
  ];

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();   // 210 mm
  const pageH = pdf.internal.pageSize.getHeight();  // 297 mm

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

    const imgData  = canvas.toDataURL("image/png");
    const canvasW  = canvas.width;
    const canvasH  = canvas.height;

    // Scale image to page width; if it exceeds page height, scale down further
    let imgW = pageW;
    let imgH = (canvasH / canvasW) * pageW;
    if (imgH > pageH) {
      const scale = pageH / imgH;
      imgW *= scale;
      imgH  = pageH;
    }

    pdf.addImage(imgData, "PNG", 0, 0, imgW, imgH);
  }

  wrapper.style.opacity  = "0";
  wrapper.style.pointerEvents = "none";

  const safeName = (clientName || "Report")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "_");
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  pdf.save(`KA_NewTaxAct_${safeName}_${dateStr}.pdf`);
}
