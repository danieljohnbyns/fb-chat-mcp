import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'sendTypingIndicator',
	{
		title: 'Send Typing Indicator',
		description: 'Send typing indicator',
		inputSchema: {
			threadId: z
				.string()
				.transform((id) => BigInt(id))
				.describe('Thread ID'),
			isTyping: z.boolean().optional().describe('Whether typing or not'),
			isGroup: z.boolean().optional().describe('Whether it\'s a group chat')
		}
	},
	async ({
		threadId,
		isTyping,
		isGroup
	}: {
		threadId: string;
		isTyping?: Parameters<(typeof messengerClient)['sendTypingIndicator']>[1];
		isGroup?: Parameters<(typeof messengerClient)['sendTypingIndicator']>[2];
	}) => {
		await messengerClient.sendTypingIndicator(
			BigInt(threadId),
			isTyping,
			isGroup
		);
		return {
			content: [{ type: 'text' as const, text: 'Typing indicator sent.' }],
			structuredContent: {
				threadId,
				isTyping: isTyping ?? null,
				isGroup: isGroup ?? null
			}
		};
	}
);
