import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'unmuteThread',
	{
		title: 'Unmute Thread',
		description: 'Unmute a thread',
		inputSchema: {
			threadId: z
				.string()
				.transform((id) => BigInt(id))
				.describe('Thread ID')
		}
	},
	async ({ threadId }: { threadId: string }) => {
		await messengerClient.unmuteThread(BigInt(threadId));
		return {
			content: [{ type: 'text' as const, text: 'Thread unmuted.' }],
			structuredContent: { threadId }
		};
	}
);
