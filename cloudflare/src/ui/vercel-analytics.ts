// Vercel Web Analytics & Speed Insights Injection Snippet
// Injected into <head> across all HTML pages.
// Automatically captured by Vercel edge infrastructure on https://ultrademon.site

export const VERCEL_ANALYTICS_SCRIPT = `
  <!-- Vercel Web Analytics & Speed Insights -->
  <script>
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
  </script>
  <script defer src="/_vercel/insights/script.js"></script>
  <script defer src="/_vercel/speed-insights/script.js"></script>
`;
