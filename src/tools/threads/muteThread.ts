import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'muteThread',
	{
		title: 'Mute Thread',
		description: 'Mute a thread',
		inputSchema: {
			threadId: z
				.string()
				.transform((id) => BigInt(id))
				.describe('Thread ID'),
			muteSeconds: z
				.number()
				.optional()
				.describe('Duration in seconds (-1 for forever, 0 to unmute)')
		}
	},
	async ({
		threadId,
		muteSeconds
	}: {
		threadId: string;
		muteSeconds?: Parameters<(typeof messengerClient)['muteThread']>[1];
	}) => {
		await messengerClient.muteThread(BigInt(threadId), muteSeconds);
		return {
			content: [{ type: 'text' as const, text: 'Thread muted.' }],
			structuredContent: { threadId, muteSeconds: muteSeconds ?? null }
		};
	}
);
