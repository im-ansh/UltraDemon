# Design & Theme Rules for UltraSearch

1. **Light & Monochrome Theme**:
   - The theme MUST always be light mode with clean white (`#ffffff`), warm off-whites (`#fafafa`, `#f4f4f5`), and crisp monochrome grays (`#e4e4e7`, `#a1a1aa`, `#71717a`, `#18181b`, `#09090b`).
   - Default text color is deep black (`#09090b` or `#18181b`) on white surfaces.

2. **Strict Prohibition on Gradients**:
   - NEVER use gradients (`linear-gradient`, `radial-gradient`, `conic-gradient`, `bg-gradient-...`, `text-gradient`) anywhere across UI elements, backgrounds, text, borders, or buttons unless the user explicitly asks for them.

3. **Strict Prohibition on Purple & Pink**:
   - NEVER use purple or pink hues (`#7c3aed`, `#8b5cf6`, `#c084fc`, `violet`, `fuchsia`, `purple`, `pink`) unless explicitly asked for.
   - Use high-contrast monochrome tones: solid black (`#000000`, `bg-black text-white`), clean white with crisp border (`bg-white text-black border border-neutral-300`), and neutral accents.

4. **Typography Standards**:
   - **Serif Texts**: Michelangelus Font with **bold italic** (`font-family: 'Michelangelus', 'Newsreader', 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-weight: 700; font-style: italic;`).
   - **Sans Texts**: Geist Sans for all general interface text, body paragraphs, and labels.
   - **Numbers & Telemetry**: Geist Mono with tabular figures (`font-family: 'Geist Mono', monospace; font-variant-numeric: tabular-nums;`) for all counts, latencies, dates, limits, scores, and pricing amounts.

