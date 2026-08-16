#!/usr/bin/env node

import * as simpleGit from 'simple-git';
import fs from 'fs';
import path from 'path';

const git = simpleGit.default();

// Get method 'major', 'minor', 'patch' from command line arguments
const method = process.argv[2] as 'major' | 'minor' | 'patch' | undefined;
if (!['major', 'minor', 'patch'].includes(method as string)) {
	console.error(
		`Error: Invalid method '${method}'. Please use 'major', 'minor', or 'patch'.`
	);
	process.exit(1);
};

// Check current branch is main
const currentBranch = await git.revparse(['--abbrev-ref', 'HEAD']);
if (currentBranch !== 'main') {
	console.error(
		`Error: You are on branch '${currentBranch}'. Please switch to 'main' branch to release.`
	);
	process.exit(1);
};

// Check for uncommitted, untracked files, or unsynced changes
await git.fetch();
const status = await git.status();
if (status.files.length > 0) {
	console.error(
		'Error: You have uncommitted or untracked files. Please commit or stash your changes before releasing.'
	);
	process.exit(1);
};
if (status.ahead > 0) {
	console.error(
		'Error: You have unpushed commits. Please push your changes before releasing.'
	);
	process.exit(1);
};
if (status.behind > 0) {
	console.error(
		'Error: Your branch is behind origin/main. Please pull the latest changes and try again.'
	);
	process.exit(1);
};

// Read the current version from package.json
const packageJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf-8'));
const currentVersion = packageJson.version;
const versionParts = currentVersion.split('.').map(Number) as [
	number,
	number,
	number
];
if (versionParts.length !== 3 || versionParts.some(isNaN)) {
	console.error(
		`Error: Current version '${currentVersion}' is not in valid semantic versioning format.`
	);
	process.exit(1);
};

const nextVersionParts = [...versionParts] as [number, number, number];
switch (method) {
case 'major':
	nextVersionParts[0]++;
	nextVersionParts[1] = 0;
	nextVersionParts[2] = 0;
	break;
case 'minor':
	nextVersionParts[1]++;
	nextVersionParts[2] = 0;
	break;
case 'patch':
	nextVersionParts[2]++;
	break;
default:
	console.error(`Error: Invalid method '${method}'.`);
	process.exit(1);
}

const nextVersion = nextVersionParts.join('.');

// Update package.json with the new version
packageJson.version = nextVersion;
fs.writeFileSync(
	path.resolve(process.cwd(), 'package.json'),
	JSON.stringify(packageJson, null, '\t') + '\n'
);

console.log(`Version bumped from ${currentVersion} to ${nextVersion}.`);

// Commit the changes and push to the main branch
await git.add('./*');
await git.commit(`chore: bump version to ${nextVersion}`);
await git.push('origin', 'main');

console.log('Changes committed and pushed to main branch.');

// If bump method is 'major' or 'minor', create a new branch for the release
if (method === 'major' || method === 'minor') {
	const releaseBranch = `release/v${nextVersion}`;
	await git.checkoutLocalBranch(releaseBranch);
	await git.push('origin', releaseBranch);
	await git.checkout('main');
	console.log(`Release branch '${releaseBranch}' created and pushed.`);
};

