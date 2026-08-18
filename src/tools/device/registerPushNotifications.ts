import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'registerPushNotifications',
	{
		title: 'Register Push Notifications',
		description: 'Register for web push notifications',
		inputSchema: {
			endpoint: z.string().describe('Push notification endpoint URL'),
			keys: z
				.object({
					p256dh: z.string(),
					auth: z.string()
				})
				.describe('Push notification keys (p256dh and auth, base64 encoded)')
		}
	},
	async ({
		endpoint,
		keys
	}: {
		endpoint: Parameters<
			(typeof messengerClient)['registerPushNotifications']
		>[0];
		keys: Parameters<(typeof messengerClient)['registerPushNotifications']>[1];
	}) => {
		await messengerClient.registerPushNotifications(endpoint, keys);
		return {
			content: [
				{ type: 'text' as const, text: 'Push notifications registered.' }
			],
			structuredContent: { endpoint }
		};
	}
);
