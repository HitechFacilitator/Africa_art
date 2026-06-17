// Shared professional PDF template styles for HTML-to-print documents
// Used by all download/print functions across the app

export const pdfStyles = `
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Georgia', 'Times New Roman', serif;
    color: #1a1a1a;
    background: #fdfcf8;
    line-height: 1.5;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page { width: 210mm; min-height: 297mm; padding: 20mm; position: relative; overflow: hidden; }
  .watermark {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg);
    font-size: 80px; font-weight: bold; color: #f0ede5; white-space: nowrap; pointer-events: none;
    font-family: 'Helvetica', 'Arial', sans-serif; letter-spacing: 20px;
  }
  .outer-border { position: absolute; top: 10mm; left: 10mm; right: 10mm; bottom: 10mm; border: 3px solid #c9a96e; pointer-events: none; }
  .inner-border { position: absolute; top: 13mm; left: 13mm; right: 13mm; bottom: 13mm; border: 0.5px solid #c9a96e; pointer-events: none; }
  .corner { position: absolute; width: 18px; height: 18px; border: 1px solid #c9a96e; }
  .corner::after { content: ''; position: absolute; top: 3px; left: 3px; right: 3px; bottom: 3px; border: 0.5px solid #a07d4a; }
  .corner.tl { top: 18mm; left: 18mm; } .corner.tr { top: 18mm; right: 18mm; }
  .corner.bl { bottom: 18mm; left: 18mm; } .corner.br { bottom: 18mm; right: 18mm; }

  .header { text-align: center; margin-bottom: 24px; padding-top: 10px; }
  .est { font-size: 9px; letter-spacing: 6px; color: #999; font-family: 'Helvetica', 'Arial', sans-serif; text-transform: uppercase; }
  .gallery-name { font-size: 30px; font-weight: bold; color: #1a1a1a; letter-spacing: 4px; margin: 8px 0 4px; }
  .gallery-sub { font-size: 10px; color: #666; letter-spacing: 2px; }
  .divider { border: none; height: 1px; background: linear-gradient(90deg, transparent, #c9a96e, transparent); margin: 12px auto; width: 60%; }
  .divider-thin { border: none; height: 0.5px; background: linear-gradient(90deg, transparent, #a07d4a, transparent); margin: 4px auto; width: 40%; }
  .doc-title { font-size: 18px; font-weight: bold; color: #1a1a1a; letter-spacing: 3px; text-transform: uppercase; margin-top: 12px; }
  .doc-subtitle { font-size: 9px; color: #666; letter-spacing: 2px; margin-top: 4px; }

  .section { margin-bottom: 16px; }
  .section-title { font-size: 10px; font-weight: bold; color: #a07d4a; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 6px; font-family: 'Helvetica', 'Arial', sans-serif; }
  .section-line { border: none; height: 0.5px; background: #c9a96e; margin-bottom: 10px; }

  .field { display: flex; margin-bottom: 4px; font-size: 10px; }
  .field-label { font-weight: bold; color: #666; width: 140px; flex-shrink: 0; font-family: 'Helvetica', 'Arial', sans-serif; font-size: 8px; text-transform: uppercase; letter-spacing: 1px; padding-top: 1px; }
  .field-value { color: #1a1a1a; flex: 1; }

  .badge { display: inline-block; padding: 4px 16px; border-radius: 4px; color: white; font-size: 10px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; font-family: 'Helvetica', 'Arial', sans-serif; }
  .badge-valid { background: #059669; }
  .badge-revoked { background: #dc2626; }
  .badge-expired { background: #d97706; }
  .badge-held { background: #2563eb; }
  .badge-disputed { background: #dc2626; }
  .badge-refunded { background: #9333ea; }

  .hash-box { background: #f8f6f0; border-radius: 4px; padding: 10px 14px; font-family: 'Courier New', monospace; font-size: 8px; word-break: break-all; border: 1px solid #e8e4d8; }
  .hash-label { font-family: 'Helvetica', 'Arial', sans-serif; font-weight: bold; font-size: 7px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }

  .signature-section { margin-top: 30px; border-top: 0.5px solid #c9a96e; padding-top: 15px; display: flex; justify-content: space-between; }
  .sig-block { width: 45%; }
  .sig-line { border-bottom: 0.5px solid #1a1a1a; margin-bottom: 4px; height: 40px; }
  .sig-label { font-size: 8px; font-weight: bold; color: #1a1a1a; }
  .sig-sublabel { font-size: 7px; color: #666; }
  .sig-date { font-size: 7px; color: #999; text-align: center; margin-top: 4px; }

  .footer { position: absolute; bottom: 15mm; left: 20mm; right: 20mm; text-align: center; border-top: 0.5px solid #c9a96e; padding-top: 8px; }
  .footer p { font-size: 6px; color: #999; font-family: 'Helvetica', 'Arial', sans-serif; line-height: 1.6; }

  .amount { font-size: 22px; font-weight: bold; color: #1a1a1a; }
  .amount-currency { font-size: 12px; color: #666; }

  table { width: 100%; border-collapse: collapse; font-size: 9px; }
  th { text-align: left; font-size: 7px; text-transform: uppercase; letter-spacing: 1px; color: #666; border-bottom: 1px solid #c9a96e; padding: 6px 8px; font-family: 'Helvetica', 'Arial', sans-serif; }
  td { padding: 6px 8px; border-bottom: 0.5px solid #e8e4d8; color: #1a1a1a; }

  @media print {
    body { background: white; }
    .page { padding: 15mm; }
  }
`;

export function buildPdfShell(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} — Aduna Gallery</title>
  <style>${pdfStyles}</style>
</head>
<body>
  <div class="page">
    <div class="watermark">ADUNA</div>
    <div class="outer-border"></div>
    <div class="inner-border"></div>
    <div class="corner tl"></div><div class="corner tr"></div>
    <div class="corner bl"></div><div class="corner br"></div>
    ${content}
  </div>
</body>
</html>`;
}

export function openPrintWindow(html: string) {
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(html);
  w.document.close();
  setTimeout(() => w.print(), 600);
}
