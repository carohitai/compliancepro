import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/** Build the filename from client name + today's date. */
function buildFilename(clientName) {
  const safeName = (clientName || "Report")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "_");
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `KA_NewTaxAct_${safeName}_${dateStr}.pdf`;
}

/** Shared capture logic — renders all page divs and builds jsPDF instance. */
async function capturePdf(clientName) {
  const wrapper = document.getElementById("wcm-pdf-template");
  if (!wrapper) throw new Error("PDF template not found");

  wrapper.style.opacity = "1";
  wrapper.style.pointerEvents = "none";
  await new Promise((r) => setTimeout(r, 120));

  const PAGE_IDS = [
    "wcm-page-cover",
    "wcm-page-nomenclature",
    "wcm-page-operations",
    "wcm-page-rates",
    "wcm-page-tds",
    "wcm-page-unchanged",
  ];

  const pdf   = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
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
      imgH  = pageH;
    }

    pdf.addImage(imgData, "PNG", 0, 0, imgW, imgH);
  }

  wrapper.style.opacity      = "0";
  wrapper.style.pointerEvents = "none";

  return { pdf, filename: buildFilename(clientName) };
}

/**
 * Generates and saves PDF to disk (user download).
 * Captures each named page div independently — no slicing, no content cuts.
 */
export async function generateWhatChangesPdf(clientName) {
  const { pdf, filename } = await capturePdf(clientName);
  pdf.save(filename);
}

/**
 * Generates PDF and returns it as a Blob + filename — does NOT save to disk.
 * Used by Phase 2 WhatsApp flow to upload the PDF and get a public URL.
 */
export async function buildPdfBlob(clientName) {
  const { pdf, filename } = await capturePdf(clientName);
  return { blob: pdf.output("blob"), filename };
}
