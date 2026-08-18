import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'getDeviceData',
	{
		title: 'Get Device Data',
		description: 'Get E2EE device data as JSON string',
		outputSchema: {
			deviceData: z.string()
		}
	},
	async () => {
		const structured = { deviceData: messengerClient.getDeviceData() };
		return {
			content: [
				{ type: 'text' as const, text: JSON.stringify(structured, null, 2) }
			],
			structuredContent: structured
		};
	}
);