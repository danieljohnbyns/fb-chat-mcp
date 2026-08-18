import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'editE2EEMessage',
	{
		title: 'Edit E2EE Message',
		description: 'Edit an E2EE message',
		inputSchema: {
			chatJid: z.string().describe('Chat JID'),
			messageId: z.string().describe('Message ID to edit'),
			newText: z.string().describe('New message text')
		}
	},
	async ({
		chatJid,
		messageId,
		newText
	}: {
		chatJid: Parameters<(typeof messengerClient)['editE2EEMessage']>[0];
		messageId: Parameters<(typeof messengerClient)['editE2EEMessage']>[1];
		newText: Parameters<(typeof messengerClient)['editE2EEMessage']>[2];
	}) => {
		await messengerClient.editE2EEMessage(chatJid, messageId, newText);
		return {
			content: [{ type: 'text' as const, text: 'E2EE message edited.' }],
			structuredContent: { messageId, newText }
		};
	}
);
