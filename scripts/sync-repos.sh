#!/usr/bin/env bash
#
# Sync vendored reference repositories under repos/.
#
# Each repo is vendored via `git subtree --squash`, so updating means running
# `git subtree pull` against its upstream branch. After pull, we re-apply any
# local trimming (see TRIM functions below) and commit the result.
#
# Run from the repository root:
#     ./scripts/sync-repos.sh           # sync everything
#     ./scripts/sync-repos.sh htmx mdn  # sync only listed repos
#
# Requires: git >= 2.20

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "error: working tree not clean. commit or stash first." >&2
  exit 1
fi

# name | prefix | url | branch
REPOS=(
  "htmx|repos/htmx|https://github.com/bigskysoftware/htmx.git|four-dev"
  "tailwindcss|repos/tailwindcss|https://github.com/tailwindlabs/tailwindcss.git|main"
  "shadcn-ui|repos/shadcn-ui|https://github.com/shadcn-ui/ui.git|main"
  "mdn|repos/mdn|https://github.com/mdn/content.git|main"
  "web.dev|repos/web.dev|https://github.com/GoogleChrome/web.dev.git|main"
  "aria-practices|repos/aria-practices|https://github.com/w3c/aria-practices.git|main"
)

trim_htmx() {
  rm -rf repos/htmx/www/public repos/htmx/www/src/assets
}

trim_mdn() {
  find repos/mdn -mindepth 1 -maxdepth 1 \
    ! -name 'files' ! -name 'README.md' ! -name 'LICENSE.md' ! -name '.gitattributes' \
    -exec rm -rf {} +
  find repos/mdn/files -mindepth 1 -maxdepth 1 ! -name 'en-us' -exec rm -rf {} +
  find repos/mdn/files/en-us -mindepth 1 -maxdepth 1 ! -name 'web' -exec rm -rf {} +
  find repos/mdn/files/en-us/web -mindepth 1 -maxdepth 1 \
    ! -name 'html' ! -name 'css' ! -name 'accessibility' ! -name 'api' ! -name 'index.md' \
    -exec rm -rf {} +
}

sync_one() {
  local name="$1" prefix="$2" url="$3" branch="$4"
  echo
  echo "==> $name ($branch)"
  git subtree pull --prefix="$prefix" "$url" "$branch" --squash \
    -m "chore($name): sync from upstream $branch"

  case "$name" in
    htmx) trim_htmx ;;
    mdn)  trim_mdn  ;;
  esac

  if [[ -n "$(git status --porcelain -- "$prefix")" ]]; then
    git add -A -- "$prefix"
    git commit -m "chore($name): re-apply local trim after sync"
  fi
}

WANTED=("$@")
for entry in "${REPOS[@]}"; do
  IFS='|' read -r name prefix url branch <<< "$entry"
  if [[ ${#WANTED[@]} -gt 0 ]]; then
    skip=true
    for w in "${WANTED[@]}"; do [[ "$w" == "$name" ]] && skip=false; done
    $skip && continue
  fi
  sync_one "$name" "$prefix" "$url" "$branch"
done

echo
echo "done."
