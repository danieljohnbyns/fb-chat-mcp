import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { z } from 'zod';
import { createStore } from 'zustand/vanilla';

export const cookiesPath =
	process.env.FB_COOKIES_PATH ??
	path.join(process.cwd(), '.tmp', 'cookies.json');

export const storedCookiesPath = path.join(
	os.homedir(),
	'.config',
	'fb-chat-mcp',
	'cookies.json'
);

const cookiesSchema = z.object({
	c_user: z.string(),
	xs: z.string(),
	datr: z.string(),
	fr: z.string()
});

export type Cookies = z.infer<typeof cookiesSchema>;

const parseCookies = (raw: string): Cookies | null => {
	const parsed = cookiesSchema.safeParse(JSON.parse(raw));
	return parsed.success ? parsed.data : null;
};

const readCookiesFile = async (filePath: string): Promise<Cookies | null> => {
	try {
		if (!existsSync(filePath)) return null;
		return parseCookies(await fs.readFile(filePath, 'utf8'));
	} catch {
		return null;
	};
};

export const writeCookiesFile = async (
	filePath: string,
	cookies: Cookies
): Promise<void> => {
	await fs.mkdir(path.dirname(filePath), { recursive: true });
	await fs.writeFile(filePath, JSON.stringify(cookies, null, '    '));
};

export const persistCookies = async (cookies: Cookies): Promise<void> => {
	await Promise.all([
		writeCookiesFile(storedCookiesPath, cookies),
		writeCookiesFile(cookiesPath, cookies)
	]);
};

const loadCookies = async (): Promise<Cookies> => {
	const fromPath = await readCookiesFile(cookiesPath);
	if (fromPath) return fromPath;

	const fromStorage = await readCookiesFile(storedCookiesPath);
	if (fromStorage) return fromStorage;

	throw new Error(
		`No cookies found. Provide them via FB_COOKIES_PATH (${cookiesPath}), .tmp/cookies.json, or the stored cookies file (${storedCookiesPath}).`
	);
};

const initialCookies = await loadCookies();
void persistCookies(initialCookies);

export const cookieStore = createStore<{
	cookies: Cookies;
	// eslint-disable-next-line no-unused-vars
	setCookies: (cookies: Cookies) => void;
		}>(() => ({
			cookies: initialCookies,
			setCookies: (cookies) => cookieStore.setState({ cookies })
		}));

cookieStore.subscribe((state) => {
	void persistCookies(state.cookies);
});
