// Ensures the meta-messenger.js native library (messagix.{so,dylib,dll})
// is present after install. npm runs dependency postinstall scripts itself,
// but bun does not by default, so this repo-level postinstall downloads the
// prebuilt binary when it is missing. Works under both node and bun.
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, '..');

const ext =
	process.platform === 'win32'
		? 'dll'
		: process.platform === 'darwin'
			? 'dylib'
			: 'so';
const nativeLib = join(
	packageRoot,
	'node_modules',
	'meta-messenger.js',
	'build',
	`messagix.${ext}`
);

if (existsSync(nativeLib)) {
	console.log(`[ensure-native] Native library already present: ${nativeLib}`);
	process.exit(0);
}

console.log(`[ensure-native] Native library missing: ${nativeLib}`);
console.log(
	'[ensure-native] Downloading prebuilt binary from GitHub Releases...'
);

const downloadScript = join(
	packageRoot,
	'node_modules',
	'meta-messenger.js',
	'scripts',
	'download-prebuilt.mjs'
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