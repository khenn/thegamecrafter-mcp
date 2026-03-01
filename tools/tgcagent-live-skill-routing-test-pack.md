# TGC Agent Live Skill Routing Test Pack (8 Prompts)

Use these prompts in `tgcagent` to validate router/focused skill behavior after Plan B split.

## Expected routing map
- Component validation prompts -> `tgc-component-preflight`
- Rulebook/book prompts -> `tgc-book-rulebook-workflows`
- Image/proof-fit prompts -> `tgc-image-preflight-fit`
- Cross-workflow orchestration prompts -> `tgc-guided-workflows`

## Prompt 1 (component preflight)
Validate required assets and finish options before creating this component.

## Prompt 2 (component preflight)
Before creating this component, verify required assets and identity side slots are complete.

## Prompt 3 (book/rulebook)
Create a rulebook from this PDF and handle page parity safely.

## Prompt 4 (book/rulebook)
I need booklet versus perfectbound guidance for this 46-page PDF with parity checks.

## Prompt 5 (image preflight/fit)
Preflight this image for safe zone and bleed before upload.

## Prompt 6 (image preflight/fit)
This dial proof clips text near trim and bleed lines; run image fit remediation and keep labels readable.

## Prompt 7 (router/orchestration)
Create a new The Game Crafter game, set surfacing, and summarize next actions.

## Prompt 8 (router/orchestration)
Build me a game creation end-to-end workflow: create a game, add a rulebook from PDF, then fix proof clipping on images.

## What to verify for each prompt
1. Agent selects the expected primary skill (or router delegates correctly).
2. Agent asks only for missing required inputs.
3. No unrelated deep references are pulled unless needed.
4. No unsafe/destructive mutation is executed without confirmation.

## Pass criteria
- 8/8 prompts route as expected or router delegates to expected focused skill.
- No excessive context-loading behavior observed.
- No regressions in previous guardrails.
