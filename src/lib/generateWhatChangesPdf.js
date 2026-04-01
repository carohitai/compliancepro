import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Renders the off-screen WhatChangesPdfTemplate div to a multi-page A4 PDF.
 * The template div must be mounted (but hidden via opacity/position) before calling this.
 */
export async function generateWhatChangesPdf(clientName) {
  const el = document.getElementById("wcm-pdf-template");
  if (!el) throw new Error("PDF template element not found");

  // Make visible for capture
  el.style.opacity = "1";
  el.style.pointerEvents = "none";

  try {
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 794,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const pageW = pdf.internal.pageSize.getWidth();   // 210mm
    const pageH = pdf.internal.pageSize.getHeight();  // 297mm

    // Each template "page" is ~1122px tall at 96dpi; canvas is 2× so ~2244px per page
    // Total canvas height / number of A4 pages
    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const ratio   = pageW / canvasW;          // mm per canvas pixel
    const totalPdfH = canvasH * ratio;        // total height in mm
    const pages   = Math.ceil(totalPdfH / pageH);

    for (let i = 0; i < pages; i++) {
      if (i > 0) pdf.addPage();

      // Clip the slice of the canvas for this page
      const srcY     = i * (canvasH / pages);
      const srcH     = canvasH / pages;

      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width  = canvasW;
      sliceCanvas.height = srcH;
      const ctx = sliceCanvas.getContext("2d");
      ctx.drawImage(canvas, 0, -srcY);

      const sliceData = sliceCanvas.toDataURL("image/png");
      pdf.addImage(sliceData, "PNG", 0, 0, pageW, pageH);
    }

    const safeName = (clientName || "Report").replace(/[^a-zA-Z0-9 ]/g, "").trim().replace(/\s+/g, "_");
    const dateStr  = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    pdf.save(`KA_NewTaxAct_${safeName}_${dateStr}.pdf`);
  } finally {
    el.style.opacity = "0";
    el.style.pointerEvents = "none";
  }
}
