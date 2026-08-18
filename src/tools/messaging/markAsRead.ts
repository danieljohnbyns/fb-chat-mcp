import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'markAsRead',
	{
		title: 'Mark As Read',
		description: 'Mark messages as read',
		inputSchema: {
			threadId: z
				.string()
				.transform((id) => BigInt(id))
				.describe('Thread ID'),
			watermarkTs: z
				.number()
				.optional()
				.describe('Timestamp to mark read up to (optional)')
		}
	},
	async ({
		threadId,
		watermarkTs
	}: {
		threadId: string;
		watermarkTs?: Parameters<(typeof messengerClient)['markAsRead']>[1];
	}) => {
		await messengerClient.markAsRead(BigInt(threadId), watermarkTs);
		return {
			content: [{ type: 'text' as const, text: 'Marked as read.' }],
			structuredContent: { threadId, watermarkTs: watermarkTs ?? null }
		};
	}
);
