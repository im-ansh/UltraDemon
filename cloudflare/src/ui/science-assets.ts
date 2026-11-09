// UltraDemon — High-Fidelity Scientific, Blueprint & Vintage Computing Assets
// Precision SVG assets for the Devin-inspired hero drifting background flow.
// Strict Design Rule: ZERO EMOJIS ANYWHERE. Monochrome technical aesthetics.

export const BLUEPRINT_CIRCUIT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" fill="none" class="w-full h-full">
  <defs>
    <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e5eb" stroke-width="0.75" stroke-dasharray="2 2" />
    </pattern>
  </defs>
  <rect width="600" height="400" fill="#fcfcfd" rx="16" stroke="#e5e5eb" stroke-width="1.5"/>
  <rect width="600" height="400" fill="url(#grid-pattern)" rx="16"/>
  
  <!-- Blueprint Title Block -->
  <rect x="380" y="330" width="200" height="55" fill="#ffffff" stroke="#d4d4d8" stroke-width="1" rx="4"/>
  <text x="390" y="348" font-family="monospace" font-size="9" fill="#71717a" font-weight="600">FIG 04.2 / ASYNC MEMORY BUS</text>
  <text x="390" y="362" font-family="monospace" font-size="8" fill="#a1a1aa">CLOCK: 100MHz SYNCHRONOUS</text>
  <text x="390" y="375" font-family="monospace" font-size="8" fill="#18181b">D1 SQLITE VECTOR ACCELERATOR</text>

  <!-- Central Processing Core / Microcontroller -->
  <rect x="220" y="130" width="160" height="130" fill="#ffffff" stroke="#18181b" stroke-width="2" rx="6" />
  <rect x="235" y="145" width="130" height="100" fill="#fafafa" stroke="#d4d4d8" stroke-width="1" />
  <text x="250" y="190" font-family="monospace" font-size="12" font-weight="bold" fill="#09090b">ULTRADEMON-M1</text>
  <text x="260" y="208" font-family="monospace" font-size="9" fill="#71717a">BM25 330-PoP EDGE</text>

  <!-- IC Pins Left -->
  <path d="M 170 150 L 220 150 M 170 170 L 220 170 M 170 190 L 220 190 M 170 210 L 220 210 M 170 230 L 220 230" stroke="#71717a" stroke-width="1.5" />
  <!-- IC Pins Right -->
  <path d="M 380 150 L 430 150 M 380 170 L 430 170 M 380 190 L 430 190 M 380 210 L 430 210 M 380 230 L 430 230" stroke="#71717a" stroke-width="1.5" />

  <!-- Logic Bus Traces & Nodes -->
  <path d="M 70 70 L 170 70 L 170 150" fill="none" stroke="#27272a" stroke-width="1.5" />
  <circle cx="70" cy="70" r="3" fill="#27272a"/>
  <circle cx="170" cy="150" r="2.5" fill="#27272a"/>

  <path d="M 60 190 L 170 190" fill="none" stroke="#71717a" stroke-width="1.5" stroke-dasharray="4 2"/>
  <circle cx="60" cy="190" r="3" fill="#71717a"/>

  <path d="M 90 280 L 140 280 L 170 230" fill="none" stroke="#27272a" stroke-width="1.5" />
  <circle cx="90" cy="280" r="3" fill="#27272a"/>

  <!-- Right Side Bus & Resistor Network -->
  <path d="M 430 150 L 510 150 L 510 90" fill="none" stroke="#27272a" stroke-width="1.5" />
  <circle cx="510" cy="90" r="3" fill="#27272a"/>

  <path d="M 430 210 L 480 210 L 520 260 L 550 260" fill="none" stroke="#71717a" stroke-width="1.5" />
  <circle cx="550" cy="260" r="3" fill="#71717a"/>

  <!-- Crystal Oscillator -->
  <rect x="70" y="110" width="40" height="20" fill="#ffffff" stroke="#71717a" stroke-width="1.5" rx="3"/>
  <text x="76" y="124" font-family="monospace" font-size="8" fill="#71717a">32.768k</text>
  <path d="M 110 120 L 170 170" stroke="#71717a" stroke-width="1.5"/>

  <!-- Technical Dimension Lines -->
  <line x1="220" y1="275" x2="380" y2="275" stroke="#a1a1aa" stroke-width="0.75" marker-start="url(#dot)" marker-end="url(#dot)" />
  <line x1="220" y1="270" x2="220" y2="280" stroke="#a1a1aa" stroke-width="0.75"/>
  <line x1="380" y1="270" x2="380" y2="280" stroke="#a1a1aa" stroke-width="0.75"/>
  <text x="285" y="288" font-family="monospace" font-size="8" fill="#a1a1aa" text-anchor="middle">24.50 mm</text>
</svg>`;

export const VINTAGE_TERMINAL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 380" fill="none" class="w-full h-full">
  <!-- CRT Outer Chassis (1982 Vintage Microcomputer) -->
  <rect x="30" y="20" width="480" height="340" rx="24" fill="#f4f4f5" stroke="#d4d4d8" stroke-width="2"/>
  <rect x="42" y="32" width="456" height="260" rx="18" fill="#e4e4e7" stroke="#d4d4d8" stroke-width="1.5"/>
  
  <!-- CRT Screen Bezel -->
  <rect x="65" y="50" width="410" height="225" rx="28" fill="#18181b" stroke="#27272a" stroke-width="4"/>
  <rect x="72" y="56" width="396" height="213" rx="22" fill="#09090b"/>
  
  <!-- CRT Phosphor Curvature & Glass Glare -->
  <path d="M 75 75 Q 270 58 465 75" stroke="#27272a" stroke-width="1" fill="none"/>
  <path d="M 85 65 Q 260 90 440 65" stroke="rgba(255,255,255,0.08)" stroke-width="2" fill="none"/>

  <!-- Retro Terminal Text Green Phosphor -->
  <text x="90" y="90" font-family="monospace" font-size="11" fill="#22c55e" font-weight="600">ULTRADEMON EDGE KERNEL v2.4 (FTS5)</text>
  <text x="90" y="110" font-family="monospace" font-size="10" fill="#86efac">CPU: D1 HYPER-ANYCAST ENGINE ONLINE</text>
  <text x="90" y="128" font-family="monospace" font-size="10" fill="#86efac">MEM: 10,000 CONCURRENT CONTEXT NODES</text>
  <text x="90" y="146" font-family="monospace" font-size="10" fill="#4ade80">&gt; RECALLING: "user_enterprise_sso_policy"</text>
  <text x="90" y="164" font-family="monospace" font-size="10" fill="#a7f3d0">  MATCH SCORE: 0.9984 (LATENCY: 11.2ms)</text>
  <text x="90" y="182" font-family="monospace" font-size="10" fill="#4ade80">&gt; SYNCING DISTRIBUTED STATE TO 330 PoPs...</text>
  <text x="90" y="200" font-family="monospace" font-size="10" fill="#22c55e">  OK. 0 PACKET LOSS. PR READY TO MERGE.</text>
  <rect x="90" y="215" width="8" height="13" fill="#22c55e">
    <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
  </rect>

  <!-- Lower Terminal Vent & Power Badge -->
  <circle cx="455" cy="275" r="3" fill="#22c55e"/>
  <text x="415" y="278" font-family="monospace" font-size="8" fill="#71717a">PWR</text>
  <rect x="80" y="310" width="380" height="8" rx="4" fill="#d4d4d8"/>
  <rect x="180" y="325" width="180" height="20" rx="6" fill="#e4e4e7" stroke="#d4d4d8" stroke-width="1"/>
  <text x="235" y="338" font-family="monospace" font-size="9" fill="#71717a" font-weight="bold">ULTRADEMON I</text>
</svg>`;

export const MATH_MANUSCRIPT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 360" fill="none" class="w-full h-full">
  <!-- Parchment / Engineering Grid Paper -->
  <rect width="500" height="360" rx="12" fill="#fafafa" stroke="#e4e4e7" stroke-width="1.5"/>
  <line x1="60" y1="0" x2="60" y2="360" stroke="#fca5a5" stroke-width="1" stroke-dasharray="3 3"/>
  
  <!-- Subtle Horizontal Grid Lines -->
  <line x1="0" y1="40" x2="500" y2="40" stroke="#f4f4f5" stroke-width="1"/>
  <line x1="0" y1="80" x2="500" y2="80" stroke="#f4f4f5" stroke-width="1"/>
  <line x1="0" y1="120" x2="500" y2="120" stroke="#f4f4f5" stroke-width="1"/>
  <line x1="0" y1="160" x2="500" y2="160" stroke="#f4f4f5" stroke-width="1"/>
  <line x1="0" y1="200" x2="500" y2="200" stroke="#f4f4f5" stroke-width="1"/>
  <line x1="0" y1="240" x2="500" y2="240" stroke="#f4f4f5" stroke-width="1"/>
  <line x1="0" y1="280" x2="500" y2="280" stroke="#f4f4f5" stroke-width="1"/>
  <line x1="0" y1="320" x2="500" y2="320" stroke="#f4f4f5" stroke-width="1"/>

  <!-- Handwritten Mathematical Formulations -->
  <text x="80" y="32" font-family="serif" font-style="italic" font-size="13" fill="#18181b">Proposition 3.1 (Sub-15ms BM25 Rank Monotonicity)</text>
  <text x="80" y="65" font-family="serif" font-size="12" fill="#3f3f46">Let Q = {q_1, ..., q_n} denote the agent query vector.</text>
  <text x="80" y="95" font-family="serif" font-size="14" fill="#09090b" font-weight="600">
    Score(D, Q) = ∑ IDF(q_i) · [ f(q_i, D) · (k_1 + 1) ] / [ f(q_i, D) + k_1 · (1 - b + b · |D|/avgdl) ]
  </text>
  <text x="80" y="130" font-family="serif" font-size="12" fill="#3f3f46">Subject to Anycast propagation constraint: τ_edge &lt; 14.2 ms.</text>

  <!-- Graph Theoretical Topological Diagram -->
  <circle cx="160" cy="220" r="16" fill="#ffffff" stroke="#18181b" stroke-width="1.5"/>
  <text x="154" y="224" font-family="monospace" font-size="11" fill="#18181b">M_0</text>
  
  <circle cx="280" cy="180" r="16" fill="#ffffff" stroke="#18181b" stroke-width="1.5"/>
  <text x="274" y="184" font-family="monospace" font-size="11" fill="#18181b">M_1</text>

  <circle cx="390" cy="230" r="16" fill="#ffffff" stroke="#18181b" stroke-width="1.5"/>
  <text x="384" y="234" font-family="monospace" font-size="11" fill="#18181b">M_2</text>

  <circle cx="260" cy="290" r="16" fill="#ffffff" stroke="#18181b" stroke-width="1.5"/>
  <text x="254" y="294" font-family="monospace" font-size="11" fill="#18181b">M_k</text>

  <!-- Directed Graph Edges -->
  <path d="M 176 220 L 264 185" stroke="#18181b" stroke-width="1.5" marker-end="url(#arrow)"/>
  <path d="M 296 185 L 374 225" stroke="#18181b" stroke-width="1.5"/>
  <path d="M 172 232 L 246 280" stroke="#71717a" stroke-width="1.5" stroke-dasharray="3 3"/>
  <path d="M 276 290 L 376 242" stroke="#71717a" stroke-width="1.5" stroke-dasharray="3 3"/>
  
  <text x="210" y="195" font-family="monospace" font-size="9" fill="#71717a">w=0.94</text>
  <text x="340" y="195" font-family="monospace" font-size="9" fill="#71717a">w=0.98</text>
  <text x="350" y="335" font-family="monospace" font-size="10" fill="#a1a1aa">Q.E.D. — ZERO DRIFT</text>
</svg>`;

export const TECHNICAL_SCHEMATIC_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 320" fill="none" class="w-full h-full">
  <rect width="480" height="320" rx="14" fill="#f8f8fa" stroke="#e5e5eb" stroke-width="1.5"/>
  
  <!-- Optical Reflector / Waveguide Diagram -->
  <path d="M 40 160 Q 240 60 440 160" stroke="#18181b" stroke-width="2" fill="none"/>
  <path d="M 40 160 Q 240 260 440 160" stroke="#18181b" stroke-width="2" fill="none"/>
  
  <!-- Incident Ray Paths -->
  <line x1="80" y1="40" x2="240" y2="160" stroke="#71717a" stroke-width="1.5" stroke-dasharray="4 2"/>
  <line x1="240" y1="160" x2="400" y2="280" stroke="#71717a" stroke-width="1.5" stroke-dasharray="4 2"/>
  
  <circle cx="240" cy="160" r="6" fill="#18181b"/>
  <circle cx="240" cy="160" r="12" stroke="#71717a" stroke-width="1" stroke-dasharray="2 2"/>
  
  <!-- Focal Labels -->
  <text x="240" y="140" font-family="monospace" font-size="10" fill="#18181b" text-anchor="middle" font-weight="bold">FOCAL POINT (F_0)</text>
  <text x="240" y="190" font-family="monospace" font-size="8" fill="#71717a" text-anchor="middle">SUB-15ms ANYCAST CONVERGENCE</text>
  
  <rect x="30" y="270" width="130" height="30" rx="6" fill="#ffffff" stroke="#d4d4d8" stroke-width="1"/>
  <text x="40" y="289" font-family="monospace" font-size="9" fill="#09090b">SPEC: 330 EDGE POPS</text>
</svg>`;

