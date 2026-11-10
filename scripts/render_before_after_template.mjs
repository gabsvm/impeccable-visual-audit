/**
 * Template script for `impeccable-visual-audit`
 * Renders a @2x side-by-side ANTES vs. DESPUÉS UI placement comparison board using Playwright.
 *
 * Usage:
 *   1. Copy this file to a scratch script (e.g. render_audit.mjs)
 *   2. Populate the `SCREENS` array with your screen's `beforeHtml`, `afterHtml`, and `legendItems`
 *   3. Run: `node render_audit.mjs`
 */
import { chromium } from 'playwright';
import path from 'path';

export const COMMON_ICONS = {
  check: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  plus: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  search: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  dotsV: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>`,
  dotsH: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/></svg>`,
  chevDown: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
  chevRight: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  close: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
};

export function buildBoardHtml({
  tag = 'AUDITORÍA DE PLACING & JERARQUÍA · IMPECCABLE SKILL',
  title = 'Comparativa Visual: Antes vs. Después',
  subtitle = 'Conservando el 100% de la identidad visual · Ajustes exclusivos de posicionamiento, jerarquía espacial y reducción de ruido',
  beforeLabel = 'ANTES (Estado Actual — Problemas de Placing)',
  afterLabel = 'DESPUÉS (Placing Corregido — Impeccable)',
  beforeHtml = '',
  afterHtml = '',
  legendItems = [],
  customCss = '',
}) {
  const legendCards = legendItems
    .map(
      (item) => `
      <div class="legend-card">
        <div class="num-pair">
          <span class="pin-badge bad" style="position:static;">${item.num}</span>
          <span class="pin-badge good" style="position:static;">${item.num}</span>
        </div>
        <div class="legend-text">
          <h4>${item.title}</h4>
          <p><span class="bad-txt">ANTES:</span> ${item.before}<br><span class="good-txt">DESPUÉS:</span> ${item.after}</p>
        </div>
      </div>`
    )
    .join('\n');

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #050507;
    color: #F4F3F8;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    padding: 28px 32px 34px;
    width: 1020px;
  }

  .board-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    border-bottom: 1px solid #1C1C23;
    padding-bottom: 16px;
    margin-bottom: 22px;
  }
  .board-title-group .tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #B668F3;
    background: rgba(155, 66, 224, 0.12);
    border: 1px solid rgba(155, 66, 224, 0.3);
    padding: 4px 10px;
    border-radius: 999px;
    margin-bottom: 8px;
  }
  .board-title-group h1 {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 30px;
    font-weight: 800;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: #FFFFFF;
  }
  .board-title-group p {
    font-size: 12.5px;
    color: #93929E;
    margin-top: 3px;
  }

  .comparison-grid {
    display: grid;
    grid-template-columns: 388px 388px;
    justify-content: space-between;
    align-items: start;
    position: relative;
    padding: 0 34px;
  }

  .col-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .col-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px 14px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .col-banner.before {
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.35);
    color: #FCA5A5;
  }
  .col-banner.after {
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.35);
    color: #6EE7B7;
  }
  .col-banner .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    display: inline-block;
    margin-right: 7px;
  }
  .col-banner.before .status-dot { background: #EF4444; box-shadow: 0 0 8px #EF4444; }
  .col-banner.after .status-dot { background: #10B981; box-shadow: 0 0 8px #10B981; }

  .phone {
    width: 388px;
    background: #0A0A0D;
    border-radius: 26px;
    border: 1.5px solid #23232C;
    overflow: hidden;
    box-shadow: 0 22px 50px rgba(0,0,0,0.65);
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .pin-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 21px;
    height: 21px;
    border-radius: 999px;
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 800;
    color: #FFFFFF;
    box-shadow: 0 3px 10px rgba(0,0,0,0.65);
    z-index: 40;
    flex-shrink: 0;
  }
  .pin-badge.bad {
    background: #EF4444;
    border: 2px solid #FCA5A5;
  }
  .pin-badge.good {
    background: #10B981;
    border: 2px solid #A7F3D0;
  }

  .outline-bad {
    outline: 1.5px dashed rgba(239, 68, 68, 0.8);
    outline-offset: 2px;
    position: relative;
  }
  .outline-good {
    outline: 1.5px dashed rgba(16, 185, 129, 0.8);
    outline-offset: 2px;
    position: relative;
  }

  .legend-grid {
    margin-top: 22px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    border-top: 1px solid #1C1C23;
    padding-top: 18px;
  }
  .legend-card {
    background: #0F0F14;
    border: 1px solid #1F1F29;
    border-radius: 10px;
    padding: 10px 12px;
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }
  .legend-card .num-pair {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    margin-top: 1px;
  }
  .legend-text h4 {
    font-size: 12px;
    font-weight: 700;
    color: #F4F3F8;
    margin-bottom: 3px;
  }
  .legend-text p {
    font-size: 11px;
    color: #93929E;
    line-height: 1.4;
  }
  .legend-text .bad-txt { color: #FCA5A5; font-weight: 600; }
  .legend-text .good-txt { color: #6EE7B7; font-weight: 600; }

  ${customCss}
</style>
</head>
<body>
  <div class="board-header">
    <div class="board-title-group">
      <div class="tag">${tag}</div>
      <h1>${title}</h1>
      <p>${subtitle}</p>
    </div>
  </div>

  <div class="comparison-grid">
    <div class="col-wrapper">
      <div class="col-banner before">
        <div><span class="status-dot"></span>${beforeLabel}</div>
      </div>
      <div class="phone">
        ${beforeHtml}
      </div>
    </div>

    <div class="col-wrapper">
      <div class="col-banner after">
        <div><span class="status-dot"></span>${afterLabel}</div>
      </div>
      <div class="phone">
        ${afterHtml}
      </div>
    </div>
  </div>

  <div class="legend-grid">
    ${legendCards}
  </div>
</body>
</html>`;
}

export async function renderBoards(screens, outputDir = process.cwd()) {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1020, height: 980 },
    deviceScaleFactor: 2,
  });

  const outputs = [];
  for (const screen of screens) {
    const html = buildBoardHtml(screen);
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(250);
    const outPath = path.resolve(outputDir, screen.filename);
    await page.screenshot({ path: outPath, fullPage: true });
    outputs.push(outPath);
    console.log('Saved @2x comparison board:', outPath);
  }

  await browser.close();
  return outputs;
}
