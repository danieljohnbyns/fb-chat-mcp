import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'sendSticker',
	{
		title: 'Send Sticker',
		description: 'Send a sticker',
		inputSchema: {
			threadId: z
				.string()
				.transform((id) => BigInt(id))
				.describe('Thread ID'),
			stickerId: z
				.string()
				.transform((id) => BigInt(id))
				.describe('Sticker ID'),
			options: z
				.object({
					replyToId: z.string().optional()
				})
				.optional()
				.describe('Optional: replyToId')
		},
		outputSchema: {
			messageId: z.string(),
			timestampMs: z.string()
		}
	},
	async ({
		threadId,
		stickerId,
		options
	}: {
		threadId: string;
		stickerId: bigint;
		options?: Parameters<(typeof messengerClient)['sendSticker']>[2];
	}) => {
		const result = await messengerClient.sendSticker(
			BigInt(threadId),
			stickerId,
			options
		);
		const structured = {
			messageId: result.messageId,
			timestampMs: result.timestampMs.toString()
		};
		return {
			content: [
				{ type: 'text' as const, text: JSON.stringify(structured, null, 2) }
			],
			structuredContent: structured
		};
	}
);
