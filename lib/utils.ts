import { marked, Renderer } from 'marked';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Custom renderer that escapes raw HTML blocks so inline HTML in
// AI-generated content cannot execute scripts in the print window.
const safeRenderer = new Renderer();
safeRenderer.html = ({ text }: { text: string }) => escapeHtml(text);

export function exportPDF(content: string, destination: string): void {
  if (!content) return;
  const printWin = window.open('', '_blank');
  if (!printWin) return;

  // Convert markdown → HTML so PDF renders formatted text, not raw symbols
  const htmlContent = marked.parse(content, { async: false, renderer: safeRenderer }) as string;

  const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  printWin.document.write(`
    <!DOCTYPE html><html><head>
    <title>Roamai – ${escapeHtml(destination)} Itinerary</title>
    <style>
      @page { margin: 2cm 2.2cm; }
      * { box-sizing: border-box; }
      body { font-family: Georgia, serif; max-width: 800px; margin: 0 auto; padding: 0 20px; color: #1A0A00; line-height: 1.8; }

      /* Watermark */
      .watermark {
        position: fixed; top: 50%; left: 50%;
        transform: translate(-50%, -50%) rotate(-42deg);
        font-size: 6rem; font-weight: bold; letter-spacing: 0.2em;
        color: rgba(139,26,26,0.045); pointer-events: none;
        white-space: nowrap; z-index: 0; font-family: Georgia, serif;
      }

      /* Header */
      .pdf-header {
        display: flex; align-items: center; justify-content: space-between;
        padding-bottom: 12px; margin-bottom: 24px;
        border-bottom: 3px solid #8B1A1A;
      }
      .pdf-brand { display: flex; align-items: center; gap: 8px; }
      .pdf-logo-r {
        width: 32px; height: 32px; background: #8B1A1A; color: #FFF8F0;
        border-radius: 7px; display: inline-flex; align-items: center;
        justify-content: center; font-weight: bold; font-size: 1.1rem;
      }
      .pdf-brand-name { font-size: 1.3rem; font-weight: bold; color: #8B1A1A; letter-spacing: 1px; }
      .pdf-brand-sub { font-size: 0.68rem; color: #C0622F; font-style: italic; display: block; margin-top: -3px; }
      .pdf-meta { text-align: right; color: #888; font-size: 0.8rem; line-height: 1.6; }

      /* Content */
      h1 { color: #8B1A1A; font-size: 1.9rem; margin: 0 0 4px; }
      h2 { color: #8B1A1A; font-size: 1.35rem; margin-top: 28px; border-bottom: 1px solid #F0D5B0; padding-bottom: 6px; }
      h3 { color: #5C3317; font-size: 1.05rem; margin-top: 16px; }
      a { color: #8B1A1A; }
      table { border-collapse: collapse; width: 100%; margin: 12px 0; }
      th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; font-size: 0.9rem; }
      th { background: #FFF3E0; font-weight: bold; }
      ul, ol { padding-left: 20px; }
      hr { border: none; border-top: 1px solid #eee; margin: 20px 0; }

      /* Footer */
      .pdf-footer {
        margin-top: 40px; padding-top: 12px;
        border-top: 2px solid #F0D5B0;
        display: flex; justify-content: space-between; flex-wrap: wrap; gap: 6px;
        color: #999; font-size: 0.72rem; font-family: sans-serif;
      }
      .pdf-footer-warn { color: #C0622F; font-style: italic; }

      @media print {
        body { margin: 0; }
        a { color: #8B1A1A; }
        .watermark { display: block; }
      }
    </style></head><body>

    <div class="watermark">ROAMAI</div>

    <!-- Header -->
    <div class="pdf-header">
      <div class="pdf-brand">
        <div class="pdf-logo-r">R</div>
        <div>
          <span class="pdf-brand-name">Roamai</span>
          <span class="pdf-brand-sub">రోమేయ్ — roam around freely</span>
        </div>
      </div>
      <div class="pdf-meta">
        <strong>${escapeHtml(destination)} Itinerary</strong><br/>
        Generated on ${escapeHtml(dateStr)}<br/>
        roamai.in
      </div>
    </div>

    <!-- Title -->
    <h1>🗺️ ${escapeHtml(destination)} Travel Plan</h1>

    <!-- AI content -->
    ${htmlContent}

    <!-- Footer -->
    <div class="pdf-footer">
      <span>© ${new Date().getFullYear()} Roamai — roamai.in</span>
      <span class="pdf-footer-warn">⚠️ AI-generated content. Verify all details before travel.</span>
      <span>Powered by Claude AI (Anthropic)</span>
    </div>

    <script>window.onload=()=>{window.print();}<\/script>
    </body></html>`);
  printWin.document.close();
}

export function shareItinerary(content: string, destination: string): void {
  if (!content) return;
  const shareText = `🪔 My ${destination} travel plan from Roamai:\n\n${content.slice(0, 500)}...\n\nPlan your trip at Roamai!`;
  if (navigator.share) {
    navigator.share({ title: `Roamai – ${destination} Itinerary`, text: shareText, url: window.location.href })
      .catch(() => copyToClipboard(shareText));
  } else {
    copyToClipboard(shareText);
  }
}

function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text).catch(() => {});
}
