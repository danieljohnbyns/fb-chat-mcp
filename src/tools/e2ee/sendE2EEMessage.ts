import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'sendE2EEMessage',
	{
		title: 'Send E2EE Message',
		description: 'Send an E2EE message',
		inputSchema: {
			chatJid: z.string().describe('Chat JID'),
			text: z.string().describe('Message text'),
			options: z
				.object({
					replyToId: z.string().optional(),
					replyToSenderJid: z.string().optional()
				})
				.optional()
				.describe('Optional: replyToId and replyToSenderJid for replies')
		},
		outputSchema: {
			messageId: z.string(),
			timestampMs: z.string()
		}
	},
	async ({
		chatJid,
		text,
		options
	}: {
		chatJid: Parameters<(typeof messengerClient)['sendE2EEMessage']>[0];
		text: Parameters<(typeof messengerClient)['sendE2EEMessage']>[1];
		options?: Parameters<(typeof messengerClient)['sendE2EEMessage']>[2];
	}) => {
		const result = await messengerClient.sendE2EEMessage(
			chatJid,
			text,
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
