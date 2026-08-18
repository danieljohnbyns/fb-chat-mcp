import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'sendMessage',
	{
		title: 'Send Message',
		description: 'Sends a message to a user.',
		inputSchema: {
			threadId: z
				.string()
				.describe('The ID of the thread to send the message to.'),
			options: z
				.object({
					text: z.string().describe('The text of the message to send.'),
					replyToId: z
						.string()
						.optional()
						.describe('The ID of the message to reply to.'),
					mentions: z
						.array(
							z.object({
								userId: z.bigint(),
								offset: z.number(),
								length: z.number()
							})
						)
						.optional()
						.describe('An array of mentions to include in the message.')
				})
				.describe('The message to send.')
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
		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2)
				}
			],
			structuredContent: { messageId: result.messageId }
		};
	}
);
