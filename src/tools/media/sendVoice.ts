import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'sendVoice',
	{
		title: 'Send Voice',
		description: 'Send a voice message',
		inputSchema: {
			threadId: z
				.string()
				.transform((id) => BigInt(id))
				.describe('Thread ID'),
			data: z.string().describe('Audio data as Buffer'),
			filename: z.string().describe('Filename'),
			options: z
				.object({
					replyToId: z.string().optional()
				})
				.optional()
				.describe('Optional: replyToId')
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
		filename: Parameters<(typeof messengerClient)['sendVoice']>[2];
		options?: Parameters<(typeof messengerClient)['sendVoice']>[3];
	}) => {
		const result = await messengerClient.sendVoice(
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
