import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'editMessage',
	{
		title: 'Edit Message',
		description: 'Edit a message',
		inputSchema: {
			messageId: z.string().describe('Message ID to edit'),
			newText: z.string().describe('New text content')
		}
	},
	async ({
		messageId,
		newText
	}: {
		messageId: Parameters<(typeof messengerClient)['editMessage']>[0];
		newText: Parameters<(typeof messengerClient)['editMessage']>[1];
	}) => {
		await messengerClient.editMessage(messageId, newText);
		return {
			content: [{ type: 'text' as const, text: 'Message edited.' }],
			structuredContent: { messageId, newText }
		};
	}
);
