# Sailing Academy

Interactive learning platform for yacht schools. This is the first prototype: module 3.2 "Points of sail" (Курсы относительно ветра).

- Theory cards with SVG diagrams; dash-underlined terms show a tooltip with the definition and the RU/EN equivalent.
- Simulator: steer the boat and trim the mainsail in 12 kn of wind, with apparent wind, speed, heel, sail efficiency and tasks (including tacking and gybing).
- Quiz (multiple choice + ordering), "Why was I wrong?" explanations, module glossary.
- "Bosun" (Боцман) AI assistant that sees the simulator state.
- Two languages, two certification tracks: RU → GIMS, EN → IYT Day Skipper.

## Structure

- `src/app.html` — the page (also published as a claude.ai artifact). Edit this file.
- `build.sh` — wraps `src/app.html` into `index.html` for Vercel. Run it after every edit and commit both.
- `api/bocman.mjs` — Vercel function for the AI assistant (raw HTTP to the Claude API).

## AI assistant

Set `ANTHROPIC_API_KEY` in the Vercel project's environment variables. Without it `/api/bocman` returns 503 and the page answers from its built-in glossary.
