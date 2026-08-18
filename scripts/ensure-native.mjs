// Ensures the meta-messenger.js native library (messagix.{so,dylib,dll})
// is present after install. npm runs dependency postinstall scripts itself,
// but bun does not by default, so this repo-level postinstall downloads the
// prebuilt binary when it is missing. Works under both node and bun, and
// resolves meta-messenger.js wherever node hoisting/pnpm layouts place it.
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);

const downloadScript = require.resolve('meta-messenger.js/scripts/download-prebuilt.mjs');
const pkgRoot = dirname(dirname(downloadScript));

const ext =
	process.platform === 'win32'
		? 'dll'
		: process.platform === 'darwin'
			? 'dylib'
			: 'so';
const nativeLib = join(pkgRoot, 'build', `messagix.${ext}`);

if (existsSync(nativeLib)) {
	console.log(`[ensure-native] Native library already present: ${nativeLib}`);
	process.exit(0);
}

// Under npm/yarn/pnpm, meta-messenger.js's own postinstall runs as part of the
// install (concurrently with ours) and downloads the native library. Installing
// again here would race that downloader and corrupt its shared temp file, so
// those installers own the download: we just verify and exit.
const isBun = String(process.env.npm_config_user_agent || '').startsWith('bun/');
if (!isBun) {
	console.warn(
		'[ensure-native] Native library missing; meta-messenger.js postinstall should have placed it.' +
			' Remove node_modules and re-run the install if this persists.'
	);
	process.exit(0);
}

// bun-only gap. When the consumer also trusts meta-messenger.js, bun runs its
// postinstall concurrently with ours; wait for that download to land (the
// prebuilt transfers in ~seconds) before falling back to downloading here.
console.log(`[ensure-native] Waiting for native library: ${nativeLib}`);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const deadline = Date.now() + 20_000;
while (Date.now() < deadline) {
	if (existsSync(nativeLib)) {
		console.log(`[ensure-native] Native library ready: ${nativeLib}`);
		process.exit(0);
	}
	await sleep(250);
}

console.log(`[ensure-native] Native library missing: ${nativeLib}`);
console.log(
	'[ensure-native] Downloading prebuilt binary from GitHub Releases...'
);

if (!existsSync(downloadScript)) {
	console.error(
		`[ensure-native] Could not find ${downloadScript}.\n` +
			'  meta-messenger.js is not installed. Run `npm install` (or `bun install`) first.'
	);
	process.exit(1);
}

const res = spawnSync(process.execPath, [downloadScript], {
	stdio: 'inherit'
});

if (res.status === 0 && existsSync(nativeLib)) {
	console.log(`[ensure-native] Native library ready: ${nativeLib}`);
	process.exit(0);
}

console.error(
	'[ensure-native] Failed to obtain the native library.\n' +
		'  Check your network connection, or install Go and run:\n' +
		'    MESSAGIX_BUILD_FROM_SOURCE=true npm install\n' +
		'  (requires clone of yumi-team/meta-messenger.js for the Go source)'
);
process.exit(1);