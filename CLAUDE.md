# Claude — Cypher Lite Project Instructions

@AGENTS.md

## Additional Notes for Claude

- Always read `AGENTS.md` first for full project context
- This project uses **Groq** (not OpenAI) — do not suggest `openai` SDK replacements
- The teaching philosophy is **Socratic** — if modifying `system-prompt.ts`, preserve the "never give direct answers" behavior
- When adding new generative UI cards, parse them in `utils/format.ts` using the `[TOOL_NAME]...[/TOOL_NAME]` marker pattern
