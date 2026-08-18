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
	}, 30000);

	afterEach(async () => {
		await client.close();
	});

	it('exposes the registered tools', async () => {
		const tools = await client.listTools();
		const names = tools.tools.map((t) => t.name);
		for (const tool of [
			'sendMessage',
			'sendReaction',
			'editMessage',
			'unsendMessage',
			'sendTypingIndicator',
			'markAsRead',
			'getUserInfo',
			'searchUsers',
			'createThread',
			'renameThread',
			'muteThread',
			'unmuteThread',
			'deleteThread',
			'uploadMedia',
			'sendImage',
			'sendVideo',
			'sendVoice',
			'sendFile',
			'sendSticker',
			'setGroupPhoto',
			'sendE2EEMessage',
			'sendE2EEReaction',
			'sendE2EETyping',
			'editE2EEMessage',
			'unsendE2EEMessage',
			'sendE2EEImage',
			'sendE2EEVideo',
			'sendE2EEAudio',
			'sendE2EEDocument',
			'sendE2EESticker',
			'downloadE2EEMedia',
			'getDeviceData',
			'registerPushNotifications'
		])
			expect(names).toContain(tool);
	});
});
