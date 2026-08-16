#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
	name: 'fb-chat-mcp',
	version: '0.1.0'
});

server.registerTool(
	'hello',
	{
		title: 'Hello',
		description: 'Returns a friendly greeting.',
		inputSchema: {
			name: z.string().optional().describe('The name to greet')
		}
	},
	async ({ name }) => {
		const subject = name ?? 'world';
		return {
			content: [{ type: 'text', text: `Hello, ${subject}!` }]
		};
	}
);

const transport = new StdioServerTransport();
await server.connect(transport);
