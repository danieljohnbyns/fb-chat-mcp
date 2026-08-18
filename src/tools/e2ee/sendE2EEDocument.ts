import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'sendE2EEDocument',
	{
		title: 'Send E2EE Document',
		description: 'Send an E2EE document/file',
		inputSchema: {
			chatJid: z.string().describe('Chat JID'),
			data: z.string().describe('File data as Buffer'),
			filename: z.string().describe('Filename'),
			mimeType: z.string().describe('MIME type'),
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
		filename,
		mimeType,
		options
	}: {
		chatJid: Parameters<(typeof messengerClient)['sendE2EEDocument']>[0];
		data: string;
		filename: Parameters<(typeof messengerClient)['sendE2EEDocument']>[2];
		mimeType: Parameters<(typeof messengerClient)['sendE2EEDocument']>[3];
		options?: Parameters<(typeof messengerClient)['sendE2EEDocument']>[4];
	}) => {
		const result = await messengerClient.sendE2EEDocument(
			chatJid,
			Buffer.from(data, 'base64'),
			filename,
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
