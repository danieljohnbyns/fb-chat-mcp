import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'unsendMessage',
	{
		title: 'Unsend Message',
		description: 'Unsend/delete a message',
		inputSchema: {
			messageId: z.string().describe('Message ID to unsend')
		}
	},
	async ({
		messageId
	}: {
		messageId: Parameters<(typeof messengerClient)['unsendMessage']>[0];
	}) => {
		await messengerClient.unsendMessage(messageId);
		return {
			content: [{ type: 'text' as const, text: 'Message unsent.' }],
			structuredContent: { messageId }
		};
	}
);
