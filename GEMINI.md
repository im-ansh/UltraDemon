# UltraDemon Workspace Rules & Guidelines

## 1. Backend Architecture Protection (Strict Confirmation Required)
- **Do not modify backend architecture without explicit confirmation**: Never change, refactor, replace, or restructure any backend architecture, database schemas (Cloudflare D1, SQLite FTS5, Supabase), API endpoints, routing engines, caching layers (KV/in-memory), or server topology without first asking the user and obtaining explicit confirmation.
- Keep all backend endpoints, data contracts, and bindings stable and backwards-compatible unless explicitly requested otherwise.

## 2. Mandatory Button & Interaction Verification Before Committing
- **Verify all button functionality before committing**: Never commit or deploy without verifying that all buttons, click handlers, tab switchers, modals, copy triggers, and interactive elements across the application work.
- **Syntax check client scripts**: All inline `<script>` tags must be tested with Node (`node -e "new Function(...)"`) to guarantee zero syntax errors (e.g., ensuring no TypeScript type annotations or missing syntax crash the browser JavaScript engine).
- **Verify handler bindings**: Verify that every `onclick`, event listener, and DOM element ID referenced in JavaScript exists and is correctly bound.

## 3. Design & Typography Standards
- **Zero emojis**: No emojis anywhere in UI, code, HTML, CSS, commits, or responses. Use clean SVG vector icons or crisp typography instead.
- **Monochrome & High Contrast**: Clean white background (`#ffffff`), neutral borders (`border-neutral-200`), dark neutral text (`#0a0a0a`), and no unrequested gradients, purples, or pinks.
- **Typography**:
  - Primary Sans: NB International Pro across all general interface text and headings.
  - Serif Accents: Michelangelus (bold italic).
  - Numbers & Telemetry: Geist Mono with tabular figures (`tabular-nums`).

## 4. Strict Prohibition on Cheap, Copied, or "AI-Slop" Design
- **Never produce cheap or generic design**: Absolutely avoid generic floating cards, bulbous border radiuses, tacky drop shadows, and lazy template styling.
- **Articulated, Line-Based & Table Architecture**: All layouts must follow a disciplined, high-density architectural standard using 1px hairline dividers, structured data tables, and crisp line-bordered panels.
- **Zero Emojis Under Any Circumstances**: Never use emojis as icons, badges, or decorations. Rely strictly on precision SVG line icons and typographic telemetry.
