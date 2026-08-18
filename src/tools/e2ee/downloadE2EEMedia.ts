import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'downloadE2EEMedia',
	{
		title: 'Download E2EE Media',
		description: 'Download and decrypt E2EE media',
		inputSchema: {
			options: z
				.object({
					directPath: z.string(),
					mediaKey: z.string(),
					mediaSha256: z.string(),
					mediaEncSha256: z.string().optional(),
					mediaType: z.string(),
					mimeType: z.string(),
					fileSize: z.string().transform((size) => BigInt(size))
				})
				.describe('Download options from attachment metadata')
		},
		outputSchema: {
			data: z.string(),
			mimeType: z.string(),
			fileSize: z.string()
		}
	},
	async ({
		options
	}: {
		options: Parameters<(typeof messengerClient)['downloadE2EEMedia']>[0];
	}) => {
		const result = await messengerClient.downloadE2EEMedia(options);
		const structured = {
			data: result.data.toString('base64'),
			mimeType: result.mimeType,
			fileSize: result.fileSize.toString()
		};
		return {
			content: [
				{ type: 'text' as const, text: JSON.stringify(structured, null, 2) }
			],
			structuredContent: structured
		};
	}
);
