---
name: impeccable-visual-audit
description: Use when the user asks to audit, review, or fix UI placement, layout, hierarchy, redundant elements, or visual clutter on a screen using Impeccable with a mandatory Before/After comparison image approval gate before modifying any source code.
metadata:
  version: 1.0.0
---

# Impeccable Visual Audit (Before / After Approval Gate)

Perform a rigorous **Impeccable** spatial placement, hierarchy, and visual noise audit on one or more UI screens, produce a high-resolution `@2x` side-by-side **ANTES vs. DESPUÉS** comparison board with numbered callout pins (`1..N`), and **stop to get explicit user approval before modifying any application code**.

## Core Rules (Non-Negotiable)

1. **HARD GATE — Zero Source Edits Before Approval:**
   - Do **NOT** edit any application source files (`.tsx`, `.ts`, `.jsx`, `.js`, `.css`, `.vue`, `.svelte`, etc.) during Phase 1.
   - You must first generate and display the side-by-side **ANTES (Estado Actual) vs. DESPUÉS (Placing Corregido)** PNG image(s) + the structured Markdown diagnostic table, and wait for the user's explicit go-ahead.
2. **Preserve Visual Identity 100% (Unless Asked Otherwise):**
   - Keep the app's existing color palette, surface tokens, typography, and brand character intact.
   - Focus strictly on **spatial placement, hierarchy, redundant controls/timers/headers, inert icons, truncated titles, action grouping, and touch target sizing (`>= 36px–44px`)**.
3. **Zero Overlapping Callout Badges:**
   - Every red/green numbered pin (`①..⑥`) on the comparison board must be placed cleanly on the frame border or whitespace (`top: -10px`, `right: -10px`, or aligned in a dedicated badge slot) so it never covers text or icons.
   - Always inspect the rendered PNG with your image-reading tool (`read_file` / `view_file`) before showing it to the user to verify zero overlaps.

---

## Phase 1: Code Inspection & Impeccable Detection

1. **Load the `impeccable` skill** (if installed in your harness) and review its `audit`, `layout`, `distill`, and `craft-floor` references.
2. **Read the exact source files** for the target screen(s) (`views/`, `components/`, CSS/theme tokens) and note exact file paths and line numbers for every placement or hierarchy issue.
3. **Run the Impeccable CLI detector** (when available in the environment) on the target component/view files:
   ```bash
   npx impeccable detect --json <target-file-or-dir>
   ```
4. **Identify 3 to 5 High-Impact Placement & Hierarchy Issues per Screen:**
   - **Redundant Status / Duplicate Indicators:** e.g., duplicate timers in sticky headers when a floating dock/pill is already active, or redundant top headers inside tabs that already have a title.
   - **Truncated Titles & Competing Controls:** e.g., session or routine titles squeezed into `max-w-[160px]` `truncate` because 4–5 buttons share the same horizontal row.
   - **Inert Decorative Icons Masquerading as Buttons:** e.g., static icons inside bordered boxes that look clickable alongside real interactive buttons.
   - **Cramped Multi-Control Rows & Touch Targets `< 44px`:** e.g., 5-column action toolbars or 8-chip horizontal rows that overflow or wrap awkwardly on mobile (`380px–390px` width).
   - **Fragmented Settings / Action Hierarchy:** e.g., destructive actions mixed with primary navigation, or orphan settings toggle rows outside a unified card.

---

## Phase 2: Generate the `@2x` Side-by-Side Before/After PNG Board

1. Copy the template script from `scripts/render_before_after_template.mjs` (inside this skill directory) to a temporary scratch script (for example in your scratch directory or `os.tmpdir()`).
2. Customize the `SCREENS` array in the script so that:
   - **Left Phone (`beforeHtml`)** faithfully renders the current UI state of the screen at mobile viewport width (`388px`), highlighting each flaw with `.outline-bad` (dashed red outline) and `<span class="pin-badge bad">1</span>`..`<span class="pin-badge bad">N</span>`.
   - **Right Phone (`afterHtml`)** renders the proposed placement fix using the exact same design tokens/colors, highlighting each improvement with `.outline-good` (dashed green outline) and `<span class="pin-badge good">1</span>`..`<span class="pin-badge good">N</span>`.
   - **Bottom Legend (`legendItems`)** lists each numbered marker (`1..N`) with its concise title, **ANTES** problem summary, and **DESPUÉS** solution summary.
3. Execute the script with Node + Playwright (`deviceScaleFactor: 2`) to produce a crisp `@2x` PNG image.
4. **Visual Verification Check:** Read/view the generated PNG file using your image inspection tool to confirm:
   - All SVG icons render properly.
   - No numbered pin badge (`1..N`) overlaps any label, button text, or icon.
   - The visual contrast between `ANTES (Estado Actual)` and `DESPUÉS (Placing Corregido)` is immediately obvious at a glance.

---

## Phase 3: Present the Audit & Wait for User Approval (STOP HERE)

Present your findings to the user in this exact structure:

1. **Embedded Before/After Image(s):**
   Embed the generated PNG(s) directly in markdown (`![Comparativa Antes y Después](file:///absolute/path/to/board.png)`).
2. **Diagnostic Table per Screen:**
   Provide a clean Markdown table mapping every numbered marker (`①`–`⑤`) to the exact code location:

   | # | Severidad | Archivo y Líneas | Problema detectado (`ANTES`) | Placing propuesto (`DESPUÉS`) |
   | :--- | :--- | :--- | :--- | :--- |
   | **①** | **P1 · Alta** | [`Component.tsx`](file:///path/to/Component.tsx#L10-L45) | Descripción concisa del solapamiento, redundancia o truncado actual. | Solución espacial exacta conservando el estilo visual. |

3. **Explicit Approval Prompt:**
   Ask the user:
   > *"¿Apruebas estos ajustes de placing para aplicarlos en el código?"*
   **STOP and wait for the user's response. Do not touch application code until approved.**

---

## Phase 4: Implementation & Verification (After User Approval Only)

Once the user approves (or requests adjustments to specific points):

1. Apply the approved placement changes cleanly in the target files (or delegate to an implementation subagent if requested by the user).
2. Write or update unit/component tests (e.g., Vitest + Testing Library) asserting the new DOM structure, absence of redundant controls, and interactive accessibility.
3. Run the project's verification suite (`vitest`, `eslint`, `tsc` / `npm run build`) and confirm zero regressions before reporting completion.
