# Design & Architecture Rules for UltraDemon

1. **Light & Monochrome Theme**:
   - The theme MUST always be light mode with clean white (`#ffffff`), warm off-whites (`#fafafa`, `#f4f4f5`), and crisp monochrome grays (`#e4e4e7`, `#a1a1aa`, `#71717a`, `#18181b`, `#09090b`).
   - Default text color is deep black (`#09090b` or `#18181b`) on white surfaces.

2. **Strict Prohibition on Gradients**:
   - NEVER use gradients (`linear-gradient`, `radial-gradient`, `conic-gradient`, `bg-gradient-...`, `text-gradient`) anywhere across UI elements, backgrounds, text, borders, or buttons unless the user explicitly asks for them.

3. **Strict Prohibition on Purple & Pink**:
   - NEVER use purple or pink hues (`#7c3aed`, `#8b5cf6`, `#c084fc`, `violet`, `fuchsia`, `purple`, `pink`) unless explicitly asked for.
   - Use high-contrast monochrome tones: solid black (`#000000`, `bg-black text-white`), clean white with crisp border (`bg-white text-black border border-neutral-300`), and neutral accents.

4. **Typography Standards**:
   - **Sans Texts**: NB International Pro across all general interface text, body paragraphs, and labels.
   - **Serif Texts**: Michelangelus Font with **bold italic** (`font-family: 'Michelangelus', 'Newsreader', 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-weight: 700; font-style: italic;`).
   - **Numbers & Telemetry**: Geist Mono with tabular figures (`font-family: 'Geist Mono', monospace; font-variant-numeric: tabular-nums;`) for all counts, latencies, dates, limits, scores, and pricing amounts.

5. **Backend Architecture Protection (Strict Confirmation Required)**:
   - NEVER alter, refactor, rewrite, replace, or restructure any backend architecture, database schema (Cloudflare D1, SQLite FTS5, Supabase), API endpoints, routing logic, KV/cache infrastructure, or server topology without first asking and receiving explicit confirmation from the user.
   - Always propose the planned backend changes and obtain explicit user consent before modifying backend files.

6. **Mandatory Button & Interactive Functionality Verification Before Committing**:
   - BEFORE committing any code or deploying, ALWAYS thoroughly test and verify that all buttons, click handlers, links, tab switches, and interactive elements across the application function properly.
   - Verify that all inline browser scripts and JavaScript code are 100% syntactically valid (via `node -e "new Function(...)"`) so that no runtime syntax errors disable client scripts or break button click listeners.
   - Verify that every referenced function exists in scope and every element ID exists in the markup.

7. **Strict Prohibition on Cheap, Copied, or Emoji-Laden Design**:
   - NEVER make the app look cheap, generic, or derivative.
   - Absolutely NO emojis anywhere in the interface, code, HTML, CSS, commits, or responses. Use clean SVG vector icons or crisp typography instead.
   - Avoid generic "card-heavy" designs with bulbous corner radiuses and tacky drop shadows.
   - Maintain a disciplined, high-density Swiss aesthetic: clean white canvas (`#ffffff`), neutral hairline 1px dividers (`border-neutral-200` / `#e5e5e5`), structured line-based tables, and articulated key-value panels.
