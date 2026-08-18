import { Client } from 'meta-messenger.js';

import { cookieStore } from './cookies.js';

const client = new Client(cookieStore.getState().cookies);
const { user } = await client.connect();

export const messengerClient = client;
export const messengerUser = user;
