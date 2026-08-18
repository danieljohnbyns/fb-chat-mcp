import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'sendMessage',
	{
		title: 'Send Message',
		description: 'Send a text message',
		inputSchema: {
			threadId: z.string().describe('Thread ID to send to'),
			options: z
				.object({
					text: z.string().describe('Text content'),
					replyToId: z.string().optional().describe('Reply to message ID'),
					attachmentFbIds: z
						.array(z.string())
						.transform((ids) => ids.map((id) => BigInt(id)))
						.optional()
						.describe(
							'Pre-uploaded attachment Facebook IDs (from uploadMedia)'
						),
					mentions: z
						.array(
							z.object({
								userId: z.string().transform((id) => BigInt(id)),
								offset: z.number(),
								length: z.number()
							})
						)
						.optional()
						.describe('User IDs to mention')
				})
				.describe('Message options (text, reply, mentions)')
		}
	},
	async ({
		threadId,
		options
	}: {
		threadId: string;
		options: Parameters<(typeof messengerClient)['sendMessage']>[1];
	}) => {
		const result = await messengerClient.sendMessage(BigInt(threadId), options);
		const serializable = {
			...result,
			timestampMs: result.timestampMs.toString()
		};
		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(serializable, null, 2)
				}
			],
			structuredContent: { messageId: result.messageId }
		};
	}
);
