import { z } from 'zod';

import registry from '../../utils/registry';
import { messengerClient } from '../../utils/client';

registry.register(
	'searchUsers',
	{
		title: 'Search Users',
		description: 'Search for users',
		inputSchema: {
			query: z.string().describe('Search query')
		},
		outputSchema: {
			results: z.array(
				z.object({
					id: z.string(),
					name: z.string(),
					username: z.string()
				})
			)
		}
	},
	async ({
		query
	}: {
		query: Parameters<(typeof messengerClient)['searchUsers']>[0];
	}) => {
		const results = await messengerClient.searchUsers(query);
		const structured = {
			results: results.map((result) => ({
				...result,
				id: result.id.toString()
			}))
		};
		return {
			content: [
				{ type: 'text' as const, text: JSON.stringify(structured, null, 2) }
			],
			structuredContent: structured
		};
	}
);
