import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'sendImage',
	{
		title: 'Send Image',
		description: 'Send an image',
		inputSchema: {
			threadId: z
				.string()
				.transform((id) => BigInt(id))
				.describe('Thread ID'),
			data: z.string().describe('Image data as Buffer'),
			filename: z.string().describe('Filename'),
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
		options
	}: {
		threadId: string;
		data: string;
		filename: Parameters<(typeof messengerClient)['sendImage']>[2];
		options?: Parameters<(typeof messengerClient)['sendImage']>[3];
	}) => {
		const result = await messengerClient.sendImage(
			BigInt(threadId),
			Buffer.from(data, 'base64'),
			filename,
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
