import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'sendE2EEImage',
	{
		title: 'Send E2EE Image',
		description: 'Send an E2EE image',
		inputSchema: {
			chatJid: z.string().describe('Chat JID'),
			data: z.string().describe('Image data as Buffer'),
			mimeType: z
				.string()
				.optional()
				.describe('MIME type (e.g., image/jpeg, image/png)'),
			options: z
				.object({
					caption: z.string().optional(),
					width: z.number().optional(),
					height: z.number().optional(),
					replyToId: z.string().optional(),
					replyToSenderJid: z.string().optional()
				})
				.optional()
				.describe('Optional caption, dimensions, and reply options')
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
		chatJid: Parameters<(typeof messengerClient)['sendE2EEImage']>[0];
		data: string;
		mimeType?: Parameters<(typeof messengerClient)['sendE2EEImage']>[2];
		options?: Parameters<(typeof messengerClient)['sendE2EEImage']>[3];
	}) => {
		const result = await messengerClient.sendE2EEImage(
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
