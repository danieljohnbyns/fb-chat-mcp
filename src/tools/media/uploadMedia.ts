import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'uploadMedia',
	{
		title: 'Upload Media',
		description: 'Upload media to Messenger',
		inputSchema: {
			threadId: z
				.string()
				.transform((id) => BigInt(id))
				.describe('Thread ID'),
			data: z.string().describe('File data as Buffer'),
			filename: z.string().describe('Filename'),
			mimeType: z.string().describe('MIME type'),
			// eslint-disable-next-line quotes
			isVoice: z.boolean().optional().describe("Whether it's a voice message")
		},
		outputSchema: {
			fbId: z.string(),
			filename: z.string()
		}
	},
	async ({
		threadId,
		data,
		filename,
		mimeType,
		isVoice
	}: {
		threadId: string;
		data: string;
		filename: Parameters<(typeof messengerClient)['uploadMedia']>[2];
		mimeType: Parameters<(typeof messengerClient)['uploadMedia']>[3];
		isVoice?: Parameters<(typeof messengerClient)['uploadMedia']>[4];
	}) => {
		const result = await messengerClient.uploadMedia(
			BigInt(threadId),
			Buffer.from(data, 'base64'),
			filename,
			mimeType,
			isVoice
		);
		const structured = {
			fbId: result.fbId.toString(),
			filename: result.filename
		};
		return {
			content: [
				{ type: 'text' as const, text: JSON.stringify(structured, null, 2) }
			],
			structuredContent: structured
		};
	}
);
