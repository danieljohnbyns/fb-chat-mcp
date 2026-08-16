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

	it('exposes the hello tool', async () => {
		const tools = await client.listTools();
		expect(tools.tools.map((t) => t.name)).toContain('hello');
	});

	it('calls hello without a name', async () => {
		const result = await client.callTool({ name: 'hello', arguments: {} });
		expect(result.content).toEqual([{ type: 'text', text: 'Hello, world!' }]);
	});

	it('calls hello with a name', async () => {
		const result = await client.callTool({
			name: 'hello',
			arguments: { name: 'Daniel' }
		});
		expect(result.content).toEqual([{ type: 'text', text: 'Hello, Daniel!' }]);
	});
});
