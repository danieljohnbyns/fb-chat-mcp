#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Client } from 'meta-messenger.js';

import { cookieStore } from './utils/cookies.js';

import packageJson from '../package.json' with { type: 'json' };

const server = new McpServer({
	name: 'fb-chat-mcp',
	version: packageJson.version
});

console.log(`Starting fb-chat-mcp v${packageJson.version}...`);

const client = new Client(cookieStore.getState().cookies);
const { user } = await client.connect();

server.registerTool(
	'getUserInfo',
	{
		title: 'Get User Info',
		description: 'Returns information about the current user.',
		inputSchema: {}
	},
	async () => {
		return {
			content: [
				{ type: 'text', text: `User ID: ${user.id}` },
				{ type: 'text', text: `User Name: ${user.name}` }
			]
		};
	}
);

client.on('fullyReady', async () => {
	const transport = new StdioServerTransport();
	await server.connect(transport);
});
console.log(`Logged in: ${user.name} (${user.id})`);
