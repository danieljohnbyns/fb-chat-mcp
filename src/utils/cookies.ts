import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { createStore } from 'zustand/vanilla';

const cookiesPath =
	process.env.FB_COOKIES_PATH ??
	path.join(process.cwd(), '.tmp', 'cookies.json');

const cookiesSchema = z.object({
	c_user: z.string(),
	xs: z.string(),
	datr: z.string(),
	fr: z.string()
});

type Cookies = z.infer<typeof cookiesSchema>;

if (!(await fs.exists(cookiesPath)))
	throw new Error(`Cookies file not found at ${cookiesPath}`);

const raw = JSON.parse(await fs.readFile(cookiesPath, 'utf8'));
const parsed = cookiesSchema.safeParse(raw);
if (!parsed.success)
	throw new Error(
		`Invalid cookies file at ${cookiesPath}: ${parsed.error.message}`
	);

export const cookieStore = createStore<
	{ cookies: Cookies } & {
		// eslint-disable-next-line no-unused-vars
		setCookies: (cookies: Cookies) => void;
			}
			>(() => ({
				cookies: parsed.data,
				setCookies: (cookies) => cookieStore.setState({ cookies })
			}));
