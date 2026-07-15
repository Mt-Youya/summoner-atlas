---
name: promote-version-to-main
description: Promote any numbered local version branch such as v2, v3, or v4 to main while preserving every existing version branch and synchronizing the selected version and main on origin. Use when the user asks to replace main with a versioned branch, release a new version branch, or archive an otherwise-unrepresented current main before promotion.
---

# Promote a version branch to main

Use the command with the version branch to promote:

```bash
bash .agents/skills/promote-version-to-main/scripts/promote.sh v3
bash .agents/skills/promote-version-to-main/scripts/promote.sh v3 --apply
bash .agents/skills/promote-version-to-main/scripts/promote.sh v3 --remote upstream --apply
```

The selected local `vN` branch is authoritative. On apply, local and remote `main` become the exact same commit and complete history as that `vN`; the corresponding `<remote>/vN` is synchronized to it too.

The remote is not tied to GitHub or a fixed repository URL. The script uses the selected version branch's configured upstream remote, then `main`'s remote, then the first configured remote. Override that choice with `--remote <name>`.

## Preservation rule

Existing version branches are never repointed. Before applying, the script checks whether the current remote main commit is already represented by a `vN` branch locally or on the selected version's ancestry.

- If it is represented or is an ancestor of the selected version, all prior version histories are already preserved and no archive branch is changed.
- If it is not represented, supply a new unused archive branch explicitly:

  ```bash
  bash .agents/skills/promote-version-to-main/scripts/promote.sh v4 --archive-current-as v3 --apply
  ```

The script refuses to overwrite an existing archive branch that points elsewhere.

## History rule

The command moves refs; it never rewrites the selected `vN` history. Consequently, the commit list shown by a hosting service for `main` must exactly equal the commit list of the selected `vN`.

If a pre-promotion main commit is already an ancestor of `vN`, it remains visible in both histories. Removing such an ancestor would require creating a new rewritten version branch, which is a different, destructive operation and is intentionally not performed by this skill.

## Procedure

1. Confirm the worktree is clean and the source branch exists locally.
2. Run the command without `--apply` and inspect the source, current main, preservation result, and planned refs.
3. Apply only after explicit user authorization.
4. Verify local source/main, remote-tracking refs, and direct remote refs have identical commit IDs and zero history divergence.

The script fetches first, uses atomic `--force-with-lease` updates, queries the configured remote directly after push, and switches away from `main` before moving its local ref. Do not replace these safeguards with an unguarded force push.
