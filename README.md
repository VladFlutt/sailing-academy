# Sailing Academy

Interactive learning platform for yacht schools, built on the IYT Day Skipper / Crew Sail syllabus.

- Course map: 7 sections, 30 modules. Ready now: sections 1 (boat and crew), 2 (safety), 3 (sailing) and 5 (rules of the road).
- Each module: a start question, learning goals, theory cards with SVG diagrams and quick checks, simulators, "on the water" practice, a quiz with explanations and the module's terms.
- Simulators: points of sail and trim, which knot, who gives way (COLREGs), night lights, IALA buoyage, man overboard drill.
- Glossary of ~160 terms; dash-underlined terms show a tooltip with the definition and the RU/EN equivalent.
- Sailor's reference: Beaufort scale, distress calls, phonetic alphabet, weather, charts, rules and organisations.
- Progress is saved in the browser (localStorage).
- "Bosun" (Боцман) AI assistant that sees the current module and simulator state.
- Two languages, two certification tracks: RU → GIMS, EN → IYT.

## Structure

No build step: static files served by Vercel.

- `index.html` — the shell; loads the scripts below in order.
- `css/app.css` — all styles, light and dark themes.
- `js/draw.js` — shared SVG helpers (boats, ships, lights, buoys, arrows).
- `js/core.js` — routing (`#home`, `#glossary`, `#resources`, `#m-3-2`), pages, quiz engine, tooltips, progress, assistant.
- `js/glossary.js`, `js/course.js` — terms, course map and the reference page.
- `js/modules/s*.js` — module content per section: `SA.MODULES['3.2'] = { title, lead, hook, goals, cards, sims, water, quiz }`.
- `js/sims/*.js` — simulators: `SA.SIMS.id = { title, intro, mount(host, { done }) }`. `trainer.js` is the shared scenario trainer.
- `api/bocman.mjs` — Vercel function for the AI assistant (raw HTTP to the Claude API).
- `legacy/` — the first single-file prototype.

To add a module: create its object in the right `js/modules/sN.js`; it appears on the course map automatically.

## AI assistant

Set `ANTHROPIC_API_KEY` in the Vercel project's environment variables. Without it `/api/bocman` returns 503 and the page answers from its built-in glossary.
