#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Client } from 'meta-messenger.js';
import { z } from 'zod';

import { cookieStore } from './utils/cookies.js';

import packageJson from '../package.json' with { type: 'json' };

const server = new McpServer({
	name: 'fb-chat-mcp',
	version: packageJson.version
});

console.log(`Starting fb-chat-mcp v${packageJson.version}...`);

const client = new Client(cookieStore.getState().cookies);
const { user, initialData } = await client.connect();
console.log(`Logged in: ${user.name} (${user.id})`);
console.log(`Thread count: ${initialData.threads.length}`);

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
