import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'createThread',
	{
		title: 'Create Thread',
		description: 'Create a 1:1 thread with a user',
		inputSchema: {
			userId: z
				.string()
				.transform((id) => BigInt(id))
				.describe('User ID to create thread with')
		},
		outputSchema: {
			threadId: z.string()
		}
	},
	async ({
		userId
	}: {
		userId: Parameters<(typeof messengerClient)['createThread']>[0];
	}) => {
		const result = await messengerClient.createThread(userId);
		const structured = { threadId: result.threadId.toString() };
		return {
			content: [
				{ type: 'text' as const, text: JSON.stringify(structured, null, 2) }
			],
			structuredContent: structured
		};
	}
);
