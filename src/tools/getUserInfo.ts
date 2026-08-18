import { z } from 'zod';

import registry from '../utils/registry.js';
import { messengerClient, messengerUser } from '../utils/client.js';

registry.register(
	'getUserInfo',
	{
		title: 'Get User Info',
		description: 'Returns information about a user, defaulting to the current user.',
		inputSchema: {
			id: z.string().optional().describe('Optional user ID to fetch info for. Defaults to the current user.')
		}
	},
	async ({ id }: { id?: string }) => {
		const info = id ? await messengerClient.getUserInfo(BigInt(id)) : messengerUser;
		const structured = { ...info, id: info.id.toString() };
		return {
			content: [{ type: 'text' as const, text: JSON.stringify(structured, null, 2) }],
			structuredContent: structured
		};
	}
);