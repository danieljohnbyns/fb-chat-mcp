import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'deleteThread',
	{
		title: 'Delete Thread',
		description: 'Delete a thread',
		annotations: { destructiveHint: true },
		inputSchema: {
			threadId: z
				.string()
				.transform((id) => BigInt(id))
				.describe('Thread ID')
		}
	},
	async ({ threadId }: { threadId: string }) => {
		await messengerClient.deleteThread(BigInt(threadId));
		return {
			content: [{ type: 'text' as const, text: 'Thread deleted.' }],
			structuredContent: { threadId }
		};
	}
);
