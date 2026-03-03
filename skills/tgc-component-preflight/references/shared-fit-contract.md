# Shared Fit Contract (Component Preflight Integration)

Use this contract when component preflight intersects image-bearing components.

## Purpose
- Keep create/update decisions consistent with image/book fit quality gates.

## Integration points
- If required image slots are missing -> block create.
- If fit workflow reports `fail` -> block mutation.
- If fit workflow reports `needs_confirmation` -> require explicit user confirmation.

## Post-mutation
- Read back the component and verify expected slot/file mappings are persisted.
- Do not mark success if mappings are missing or mismatched.
