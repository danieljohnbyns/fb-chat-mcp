import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'renameThread',
	{
		title: 'Rename Thread',
		description: 'Rename a group thread',
		inputSchema: {
			threadId: z
				.string()
				.transform((id) => BigInt(id))
				.describe('Thread ID'),
			newName: z.string().describe('New name')
		}
	},
	async ({
		threadId,
		newName
	}: {
		threadId: string;
		newName: Parameters<(typeof messengerClient)['renameThread']>[1];
	}) => {
		await messengerClient.renameThread(BigInt(threadId), newName);
		return {
			content: [{ type: 'text' as const, text: 'Thread renamed.' }],
			structuredContent: { threadId, newName }
		};
	}
);
