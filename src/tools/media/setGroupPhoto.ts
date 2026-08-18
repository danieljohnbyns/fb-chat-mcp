import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'setGroupPhoto',
	{
		title: 'Set Group Photo',
		description: 'Set group photo/avatar',
		inputSchema: {
			threadId: z
				.string()
				.transform((id) => BigInt(id))
				.describe('Thread ID'),
			data: z.string().describe('Image data as Buffer or base64 string'),
			mimeType: z
				.string()
				.optional()
				.describe('MIME type (e.g., \'image/jpeg\', \'image/png\')')
		}
	},
	async ({
		threadId,
		data,
		mimeType
	}: {
		threadId: string;
		data: string;
		mimeType?: Parameters<(typeof messengerClient)['setGroupPhoto']>[2];
	}) => {
		await messengerClient.setGroupPhoto(BigInt(threadId), data, mimeType);
		return {
			content: [{ type: 'text' as const, text: 'Group photo set.' }],
			structuredContent: { threadId }
		};
	}
);
