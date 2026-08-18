import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'sendE2EEAudio',
	{
		title: 'Send E2EE Audio',
		description: 'Send an E2EE audio/voice message',
		inputSchema: {
			chatJid: z.string().describe('Chat JID'),
			data: z.string().describe('Audio data as Buffer'),
			mimeType: z
				.string()
				.optional()
				.describe('MIME type (default: audio/ogg)'),
			options: z
				.object({
					ptt: z.boolean().optional(),
					duration: z.number().optional(),
					replyToId: z.string().optional(),
					replyToSenderJid: z.string().optional()
				})
				.optional()
				.describe(
					'Optional PTT (push-to-talk/voice message), duration, and reply options'
				)
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
		chatJid: Parameters<(typeof messengerClient)['sendE2EEAudio']>[0];
		data: string;
		mimeType?: Parameters<(typeof messengerClient)['sendE2EEAudio']>[2];
		options?: Parameters<(typeof messengerClient)['sendE2EEAudio']>[3];
	}) => {
		const result = await messengerClient.sendE2EEAudio(
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
