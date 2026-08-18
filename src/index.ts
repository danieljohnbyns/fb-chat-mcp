#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { messengerClient, messengerUser } from './utils/client.js';
import registry from './utils/registry.js';

import './tools/getUserInfo.js';

import packageJson from '../package.json' with { type: 'json' };

const server = new McpServer({
	name: 'fb-chat-mcp',
	version: packageJson.version
});

registry.registerAll(server);

console.log(`Starting fb-chat-mcp v${packageJson.version}...`);

messengerClient.on('fullyReady', async () => {
	const transport = new StdioServerTransport();
	await server.connect(transport);
});
console.log(`Logged in: ${messengerUser.name} (${messengerUser.id})`);
