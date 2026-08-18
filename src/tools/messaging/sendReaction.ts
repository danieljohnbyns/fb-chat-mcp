import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'sendReaction',
	{
		title: 'Send Reaction',
		description: 'Send / Remove a reaction to a message',
		inputSchema: {
			threadId: z
				.string()
				.transform((id) => BigInt(id))
				.describe('Thread ID'),
			messageId: z.string().describe('Message ID to react to'),
			emoji: z
				.string()
				.optional()
				.describe('Reaction emoji (to remove, simply omit this parameter)')
		}
	},
	async ({
		threadId,
		messageId,
		emoji
	}: {
		threadId: string;
		messageId: Parameters<(typeof messengerClient)['sendReaction']>[1];
		emoji?: Parameters<(typeof messengerClient)['sendReaction']>[2];
	}) => {
		await messengerClient.sendReaction(BigInt(threadId), messageId, emoji);
		return {
			content: [{ type: 'text' as const, text: 'Reaction sent.' }],
			structuredContent: { messageId }
		};
	}
);
