import { Client } from 'meta-messenger.js';

import { cookieStore, type Cookies } from './cookies.js';

const refreshInterval = process.env.REFRESH_INTERVAL_MS
	? Number(process.env.REFRESH_INTERVAL_MS)
	: 5 * 60 * 1000;

const sanitizeCookies = (cookies: Record<string, string>): Cookies | null => {
	const { c_user, xs, datr, fr } = cookies;
	if (!c_user || !xs || !datr || !fr) return null;
	return { c_user, xs, datr, fr };
};

const client = new Client(cookieStore.getState().cookies);
const { user } = await client.connect();

let lastCookies = JSON.stringify(cookieStore.getState().cookies);
setInterval(() => {
	try {
		const fresh = sanitizeCookies(client.getCookies());
		if (!fresh) return;
		const current = JSON.stringify(fresh);
		if (current !== lastCookies) {
			lastCookies = current;
			cookieStore.getState().setCookies(fresh);
		};
	} catch {
		// ignore transient refresh errors
	};
}, refreshInterval);

export const messengerClient = client;
export const messengerUser = user;
