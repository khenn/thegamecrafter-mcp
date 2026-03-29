# TGCMCP npm Release Playbook

Use this playbook when a TGCMCP change should affect the public installer command:

```bash
npx @tgcmcp/thegamecrafter-mcp@latest
```

This playbook covers the npm part of a release. It complements `docs/RELEASE_PROCESS.md` and `docs/RELEASE_CHECKLIST.md`.

## Preconditions

- The intended release commit is already on `main`.
- `code/package.json` has the target version.
- You are authenticated to npm with permission to publish `@tgcmcp/thegamecrafter-mcp`.
- If npm publish requires interactive auth, complete the web/passkey or token flow before retrying.

## Publish Steps

1. Verify package metadata:

```bash
cd /home/khenny/tgcmcp/code
npm pkg get name version
```

Expected package name:

```text
@tgcmcp/thegamecrafter-mcp
```

2. Run the pre-publish gates:

```bash
npm run typecheck
npm run build
npm test
npm run skills:test
npm publish --dry-run
```

3. Publish the package:

```bash
npm publish
```

4. Verify npm metadata:

```bash
npm view @tgcmcp/thegamecrafter-mcp version
```

5. Verify the public installer path in a clean temp directory:

```bash
TEST_DIR=$(mktemp -d "$HOME/tgcmcp-published-XXXXXX")
cd "$TEST_DIR"
npx @tgcmcp/thegamecrafter-mcp@latest
find .tgcmcp -maxdepth 3 -type f | sort
```

Expected installed files include:

- `.tgcmcp/server/index.js`
- `.tgcmcp/skills/`
- `.tgcmcp/TGCAGENT.md`
- `.tgcmcp/manifest.json`
- `.tgcmcp/README.md`

6. If the package was published under a new name or scope, confirm:

- `README.md` uses the same `npx` command
- release docs reference the same package name
- test fixtures expecting the package name are updated

## Post-Publish Notes

- GitHub pushes do not update npm automatically.
- Any installer-affecting change requires a new npm version publish from `code/`.
- If you used a temporary publish token, revoke or rotate it after the release.
