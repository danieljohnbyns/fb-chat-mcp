import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'sendE2EETyping',
	{
		title: 'Send E2EE Typing',
		description: 'Send E2EE typing indicator',
		inputSchema: {
			chatJid: z.string().describe('Chat JID'),
			isTyping: z.boolean().optional().describe('Whether typing')
		}
	},
	async ({
		chatJid,
		isTyping
	}: {
		chatJid: Parameters<(typeof messengerClient)['sendE2EETyping']>[0];
		isTyping?: Parameters<(typeof messengerClient)['sendE2EETyping']>[1];
	}) => {
		await messengerClient.sendE2EETyping(chatJid, isTyping);
		return {
			content: [{ type: 'text' as const, text: 'E2EE typing indicator sent.' }],
			structuredContent: { chatJid, isTyping: isTyping ?? null }
		};
	}
);
