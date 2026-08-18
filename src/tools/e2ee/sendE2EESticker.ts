import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'sendE2EESticker',
	{
		title: 'Send E2EE Sticker',
		description: 'Send an E2EE sticker',
		inputSchema: {
			chatJid: z.string().describe('Chat JID'),
			data: z.string().describe('Sticker data as Buffer (WebP format)'),
			mimeType: z
				.string()
				.optional()
				.describe('MIME type (default: image/webp)'),
			options: z
				.object({
					replyToId: z.string().optional(),
					replyToSenderJid: z.string().optional()
				})
				.optional()
				.describe('Optional reply options')
		},
		outputSchema: {
			messageId: z.string(),
			timestampMs: z.string()
		}
	},
	async ({
		chatJid,
		data,
		mimeType,
		options
	}: {
		chatJid: Parameters<(typeof messengerClient)['sendE2EESticker']>[0];
		data: string;
		mimeType?: Parameters<(typeof messengerClient)['sendE2EESticker']>[2];
		options?: Parameters<(typeof messengerClient)['sendE2EESticker']>[3];
	}) => {
		const result = await messengerClient.sendE2EESticker(
			chatJid,
			Buffer.from(data, 'base64'),
			mimeType,
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
