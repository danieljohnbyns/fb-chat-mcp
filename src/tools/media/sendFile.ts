import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'sendFile',
	{
		title: 'Send File',
		description: 'Send a file',
		inputSchema: {
			threadId: z
				.string()
				.transform((id) => BigInt(id))
				.describe('Thread ID'),
			data: z.string().describe('File data as Buffer'),
			filename: z.string().describe('Filename'),
			mimeType: z.string().describe('MIME type'),
			options: z
				.object({
					caption: z.string().optional(),
					replyToId: z.string().optional()
				})
				.optional()
				.describe('Optional: caption and replyToId')
		},
		outputSchema: {
			messageId: z.string(),
			timestampMs: z.string()
		}
	},
	async ({
		threadId,
		data,
		filename,
		mimeType,
		options
	}: {
		threadId: string;
		data: string;
		filename: Parameters<(typeof messengerClient)['sendFile']>[2];
		mimeType: Parameters<(typeof messengerClient)['sendFile']>[3];
		options?: Parameters<(typeof messengerClient)['sendFile']>[4];
	}) => {
		const result = await messengerClient.sendFile(
			BigInt(threadId),
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
