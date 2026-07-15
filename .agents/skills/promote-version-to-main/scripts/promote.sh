#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0 vN [--remote name] [--archive-current-as vN] [--apply]" >&2
  exit 2
}

source_branch=""
archive_branch=""
remote=""
apply=false

while (( $# )); do
  case "$1" in
    --apply)
      apply=true
      shift
      ;;
    --archive-current-as)
      (( $# >= 2 )) || usage
      archive_branch="$2"
      shift 2
      ;;
    --remote)
      (( $# >= 2 )) || usage
      remote="$2"
      shift 2
      ;;
    v[0-9]*)
      [[ -z $source_branch ]] || usage
      source_branch="$1"
      shift
      ;;
    *)
      usage
      ;;
  esac
done

[[ $source_branch =~ ^v[0-9]+$ ]] || usage
[[ -z $archive_branch || $archive_branch =~ ^v[0-9]+$ ]] || usage
[[ $archive_branch != "$source_branch" ]] || usage

git diff --quiet && git diff --cached --quiet || {
  echo "Refusing to proceed with a dirty worktree." >&2
  exit 1
}

if [[ -z $remote ]]; then
  remote=$(git config --get "branch.$source_branch.remote" 2>/dev/null || git config --get branch.main.remote 2>/dev/null || git remote | head -n1)
fi
[[ -n $remote ]] || {
  echo "Refusing to proceed without a configured remote; pass --remote <name>." >&2
  exit 1
}
remote_url=$(git remote get-url "$remote") || {
  echo "Unknown remote '$remote'." >&2
  exit 1
}

git fetch "$remote" --prune

source_commit=$(git rev-parse --verify "refs/heads/$source_branch") || {
  echo "Refusing to proceed without local branch '$source_branch'." >&2
  exit 1
}
remote_main=$(git rev-parse --verify "refs/remotes/$remote/main")
remote_source=$(git rev-parse --verify "refs/remotes/$remote/$source_branch" 2>/dev/null || true)

preserved_by=$(git for-each-ref --format='%(refname:short) %(objectname)' refs/heads/v* "refs/remotes/$remote/v*" | awk -v commit="$remote_main" '$2 == commit { print $1; exit }')
needs_archive=false
if [[ -z $preserved_by && $remote_main != "$source_commit" ]]; then
  needs_archive=true
fi

if $needs_archive; then
  [[ -n $archive_branch ]] || {
    echo "Current main is not represented by a version branch. Re-run with --archive-current-as vN." >&2
    exit 1
  }
  existing_archive=$(git rev-parse --verify "refs/heads/$archive_branch" 2>/dev/null || git rev-parse --verify "refs/remotes/$remote/$archive_branch" 2>/dev/null || true)
  [[ -z $existing_archive || $existing_archive == "$remote_main" ]] || {
    echo "Archive branch '$archive_branch' already points to a different commit." >&2
    exit 1
  }
fi

printf 'source branch:    %s\n' "$source_branch"
printf 'remote:           %s (%s)\n' "$remote" "$remote_url"
printf 'source commit:    %s\n' "$source_commit"
printf 'remote main now:  %s\n' "$remote_main"
printf 'remote source:    %s\n' "${remote_source:-<absent>}"
if $needs_archive; then
  printf 'archive current:  %s -> %s\n' "$archive_branch" "$remote_main"
else
  printf 'main preserved:   %s\n' "${preserved_by:-already identical to source}"
fi
printf 'planned main:     %s\n' "$source_commit"
printf 'planned source:   %s\n' "$source_commit"
if [[ $remote_main != "$source_commit" ]] && git merge-base --is-ancestor "$remote_main" "$source_commit"; then
  echo "note: current main is already an ancestor of the source and will remain in the promoted history."
fi

if ! $apply; then
  echo "Dry run only. Re-run with --apply after explicit user approval."
  exit 0
fi

current_branch=$(git symbolic-ref --quiet --short HEAD || true)
if [[ $current_branch == "main" ]]; then
  git switch "$source_branch"
fi

refspecs=("$source_branch:$source_branch" "main:main")
lease_args=("--force-with-lease=main:$remote_main")
if [[ -n $remote_source ]]; then
  lease_args+=("--force-with-lease=$source_branch:$remote_source")
else
  lease_args+=("--force-with-lease=$source_branch:")
fi

if $needs_archive; then
  git branch "$archive_branch" "$remote_main"
  refspecs+=("$archive_branch:$archive_branch")
  lease_args+=("--force-with-lease=$archive_branch:")
fi

git branch -f main "$source_commit"
git push --atomic "${lease_args[@]}" "$remote" "${refspecs[@]}"

git fetch "$remote" --prune
direct_main=$(git ls-remote --heads "$remote" main | awk '$2 == "refs/heads/main" { print $1 }')
direct_source=$(git ls-remote --heads "$remote" "$source_branch" | awk -v branch="refs/heads/$source_branch" '$2 == branch { print $1 }')
printf '\nVerified refs:\n'
git show-ref --verify "refs/heads/$source_branch"
git show-ref --verify refs/heads/main
git show-ref --verify "refs/remotes/$remote/$source_branch"
git show-ref --verify "refs/remotes/$remote/main"
printf 'direct remote main:   %s\n' "$direct_main"
printf 'direct remote source: %s\n' "$direct_source"

test "$(git rev-parse "refs/heads/$source_branch")" = "$(git rev-parse refs/heads/main)"
test "$(git rev-parse "refs/heads/$source_branch")" = "$(git rev-parse "refs/remotes/$remote/$source_branch")"
test "$(git rev-parse "refs/heads/$source_branch")" = "$(git rev-parse "refs/remotes/$remote/main")"
test "$(git rev-parse "refs/heads/$source_branch")" = "$direct_source"
test "$(git rev-parse "refs/heads/$source_branch")" = "$direct_main"
test "$(git rev-list --left-right --count "$source_branch...main")" = $'0\t0'
test "$(git rev-list --left-right --count "$remote/$source_branch...$remote/main")" = $'0\t0'
