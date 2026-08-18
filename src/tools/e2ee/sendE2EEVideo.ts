import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'sendE2EEVideo',
	{
		title: 'Send E2EE Video',
		description: 'Send an E2EE video',
		inputSchema: {
			chatJid: z.string().describe('Chat JID'),
			data: z.string().describe('Video data as Buffer'),
			mimeType: z
				.string()
				.optional()
				.describe('MIME type (default: video/mp4)'),
			options: z
				.object({
					caption: z.string().optional(),
					width: z.number().optional(),
					height: z.number().optional(),
					duration: z.number().optional(),
					replyToId: z.string().optional(),
					replyToSenderJid: z.string().optional()
				})
				.optional()
				.describe('Optional caption, dimensions, duration, and reply options')
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
		chatJid: Parameters<(typeof messengerClient)['sendE2EEVideo']>[0];
		data: string;
		mimeType?: Parameters<(typeof messengerClient)['sendE2EEVideo']>[2];
		options?: Parameters<(typeof messengerClient)['sendE2EEVideo']>[3];
	}) => {
		const result = await messengerClient.sendE2EEVideo(
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
