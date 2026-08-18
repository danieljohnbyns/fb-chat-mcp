import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'unsendE2EEMessage',
	{
		title: 'Unsend E2EE Message',
		description: 'Unsend/delete an E2EE message',
		inputSchema: {
			chatJid: z.string().describe('Chat JID'),
			messageId: z.string().describe('Message ID to unsend')
		}
	},
	async ({
		chatJid,
		messageId
	}: {
		chatJid: Parameters<(typeof messengerClient)['unsendE2EEMessage']>[0];
		messageId: Parameters<(typeof messengerClient)['unsendE2EEMessage']>[1];
	}) => {
		await messengerClient.unsendE2EEMessage(chatJid, messageId);
		return {
			content: [{ type: 'text' as const, text: 'E2EE message unsent.' }],
			structuredContent: { messageId }
		};
	}
);
