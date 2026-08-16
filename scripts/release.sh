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

read_version() {
	node -p "require('./package.json').version || '0.0.0'"
}

bump_version() {
	node -e '
		const [method, current] = [process.argv[1], process.argv[2]];
		const [major, minor, patch] = current.split(".").map(Number);
		let next;
		if (method === "major") next = `${major + 1}.0.0`;
		else if (method === "minor") next = `${major}.${minor + 1}.0`;
		else next = `${major}.${minor}.${patch + 1}`;
		process.stdout.write(next);
	' "$1" "$2"
}

write_version() {
	node -e '
		const fs = require("fs");
		const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
		pkg.version = process.argv[1];
		fs.writeFileSync("package.json", JSON.stringify(pkg, null, "\t") + "\n");
	' "$1"
}

scope_branch() {
	printf 'npm-v%s' "$(printf '%s' "$1" | cut -d. -f1,2)"
}

commit_and_push() {
	git add package.json bun.lock
	git commit -m "chore(release): v$NEXT"
	git push origin "$TARGET"
}

CURRENT="$(read_version)"

case "$METHOD" in
	patch)
		TARGET="$(scope_branch "$CURRENT")"
		if ! git ls-remote --heads origin "$TARGET" 2>/dev/null | grep -q .; then
			echo "error: branch '$TARGET' does not exist on origin; release a minor version first" >&2
			exit 1
		fi

		git fetch origin
		git checkout -B "$TARGET" "origin/$TARGET"
		FROM="$(read_version)"
		NEXT="$(bump_version patch "$FROM")"
		write_version "$NEXT"
		bun install
		commit_and_push
		;;
	major | minor)
		NEXT="$(bump_version "$METHOD" "$CURRENT")"
		TARGET="$(scope_branch "$NEXT")"

		if git rev-parse --verify --quiet "$TARGET" >/dev/null; then
			echo "error: local branch '$TARGET' already exists" >&2
			exit 1
		fi

		if git ls-remote --heads origin "$TARGET" 2>/dev/null | grep -q .; then
			echo "error: branch '$TARGET' already exists on origin" >&2
			exit 1
		fi

		write_version "$NEXT"
		bun install
		git checkout -b "$TARGET"
		git add package.json bun.lock
		git commit -m "chore(release): v$NEXT"
		git push -u origin "$TARGET"
		FROM="$CURRENT"
		;;
esac

echo "released $FROM -> $NEXT on branch $TARGET"

git checkout main
git fetch origin main
if git merge --ff-only origin/main >/dev/null 2>&1; then
	write_version "$NEXT"
	if ! git diff --quiet package.json; then
		git add package.json
		git commit -m "chore: bump main to v$NEXT"
		git push origin main
	fi
else
	echo "warning: main has diverged from origin/main; skipping main version bump" >&2
fi