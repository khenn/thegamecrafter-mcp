# TGC Book/Rulebook Workflow

## Optioning
- If user asks for a "rulebook" without component type, present up to 3 implemented options.
- Include key constraints (parity, bind style, typical risk profile, cost signal if available).

## Parity and Sequencing
- Validate page-count parity rules before mutation.
- If source pages do not meet parity:
  - propose blank-page padding,
  - or alternate component option.
- Preserve explicit page order and sequence numbers.

## Print Safety
- Enforce gutter-aware safe zones for bound books.
- Keep text inside conservative safe frame when template-safe zones are not explicitly available.

## Output Contract
- `selected_component`
- `page_plan` (source range, parity action, total pages)
- `mutation_sequence`
- `proof_risks`
