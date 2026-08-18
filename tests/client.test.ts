import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

describe('fb-chat-mcp test client', () => {
	let client: Client;
	let transport: StdioClientTransport;

	beforeEach(async () => {
		transport = new StdioClientTransport({
			command: 'bun',
			args: ['run', 'src/index.ts']
		});
		client = new Client({ name: 'test-client', version: '0.1.0' });
		await client.connect(transport);
	});

	afterEach(async () => {
		await client.close();
	});

	it('exposes the registered tools', async () => {
		const tools = await client.listTools();
		const names = tools.tools.map((t) => t.name);
		for (const tool of [
			'sendMessage',
			'getUserInfo',
			'searchUsers',
			'createThread',
			'deleteThread',
			'uploadMedia',
			'sendImage',
			'sendSticker',
			'sendE2EEMessage',
			'editE2EEMessage',
			'downloadE2EEMedia',
			'getDeviceData',
			'registerPushNotifications'
		]) {
			expect(names).toContain(tool);
		}
	});
});