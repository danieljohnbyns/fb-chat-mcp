import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient, messengerUser } from '../../utils/client';

registry.register(
	'getUserInfo',
	{
		title: 'Get User Info',
		description: 'Get detailed information about a user',
		inputSchema: {
			userId: z
				.string()
				.transform((id) => BigInt(id))
				.optional()
				.describe('User ID')
		}
	},
	async ({
		userId
	}: {
		userId?: Parameters<(typeof messengerClient)['getUserInfo']>[0];
	}) => {
		const info = userId
			? await messengerClient.getUserInfo(userId)
			: messengerUser;
		const structured = { ...info, id: info.id.toString() };
		return {
			content: [
				{ type: 'text' as const, text: JSON.stringify(structured, null, 2) }
			],
			structuredContent: structured
		};
	}
);
