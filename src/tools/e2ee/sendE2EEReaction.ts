import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'sendE2EEReaction',
	{
		title: 'Send E2EE Reaction',
		description: 'Send / Remove an E2EE reaction',
		inputSchema: {
			chatJid: z.string().describe('Chat JID'),
			messageId: z.string().describe('Message ID'),
			senderJid: z.string().describe('Sender JID'),
			emoji: z
				.string()
				.optional()
				.describe('Reaction emoji (To remove it, simply omit this parameter)')
		}
	},
	async ({
		chatJid,
		messageId,
		senderJid,
		emoji
	}: {
		chatJid: Parameters<(typeof messengerClient)['sendE2EEReaction']>[0];
		messageId: Parameters<(typeof messengerClient)['sendE2EEReaction']>[1];
		senderJid: Parameters<(typeof messengerClient)['sendE2EEReaction']>[2];
		emoji?: Parameters<(typeof messengerClient)['sendE2EEReaction']>[3];
	}) => {
		await messengerClient.sendE2EEReaction(
			chatJid,
			messageId,
			senderJid,
			emoji
		);
		return {
			content: [{ type: 'text' as const, text: 'E2EE reaction sent.' }],
			structuredContent: { messageId, senderJid }
		};
	}
);
