#!/usr/bin/env bash
set -euo pipefail

METHOD="${1:-}"
case "$METHOD" in
	major | minor | patch) ;;
	*)
		echo "usage: ./scripts/release.sh <major|minor|patch>" >&2
		exit 1
		;;
esac

if ! git diff --quiet; then
	echo "error: working tree has uncommitted changes" >&2
	exit 1
fi

CURRENT="$(node -p "require('./package.json').version || '0.0.0'")"
NEXT="$(node -e '
		const method = process.argv[1];
		const [major, minor, patch] = process.argv[2].split(".").map(Number);
		let next;
		if (method === "major") next = `${major + 1}.0.0`;
		else if (method === "minor") next = `${major}.${minor + 1}.0`;
		else next = `${major}.${minor}.${patch + 1}`;
		process.stdout.write(next);
	' "$METHOD" "$CURRENT")"
BRANCH="npm-v$NEXT"

if git rev-parse --verify --quiet "$BRANCH" >/dev/null; then
	echo "error: local branch '$BRANCH' already exists" >&2
	exit 1
fi

if git ls-remote --heads origin "$BRANCH" 2>/dev/null | grep -q .; then
	echo "error: branch '$BRANCH' already exists on origin" >&2
	exit 1
fi

node -e '
	const fs = require("fs");
	const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
	pkg.version = process.argv[1];
	fs.writeFileSync("package.json", JSON.stringify(pkg, null, "\t") + "\n");
' "$NEXT"
bun install

git checkout -b "$BRANCH"
git add package.json bun.lock
git commit -m "chore(release): v$NEXT"
git push -u origin "$BRANCH"

echo "released $CURRENT -> $NEXT on branch $BRANCH"

git checkout main