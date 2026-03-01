# TGC Skill Routing Map

Use this map to choose the primary skill with minimal context loading.

## Route to `tgc-guided-workflows` (router)
Use when request is broad or cross-workflow:
- create/manage game lifecycle
- combine multiple workflow families in one request
- surfacing/readiness/test reports
- high-level orchestration and sequencing

## Route to `tgc-component-preflight`
Use when request is primarily about component validity before mutation:
- required assets/slots
- finish options
- quantity bounds
- side/page/identity completeness
- create vs in-place update safety

## Route to `tgc-book-rulebook-workflows`
Use when request centers on books/rulebooks:
- booklet/coil/perfectbound optioning
- page parity constraints
- cover/interior sequencing
- PDF/page import planning

## Route to `tgc-image-preflight-fit`
Use when request centers on art placement quality:
- safe-zone/bleed/trim checks
- proof clipping remediation
- fit intent selection
- geometry conflicts (including dial-specific readability)

## Tie-break Rules
1. If user asks for one specific domain (book, component, image), pick focused skill.
2. If user asks for a full end-to-end workflow spanning domains, start with router and delegate.
3. If uncertain, ask one clarifying question before mutation.
