import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const TOOLS_DIR = join(__dirname, '..', 'src', 'tools');

const toolFiles = async () =>
	(await readdir(TOOLS_DIR, { recursive: true }))
		.filter((f) => String(f).endsWith('.ts'))
		.map((f) => join(TOOLS_DIR, String(f)));

const registeredToolNames = async () =>
	(
		await Promise.all(
			(await toolFiles()).map(async (file) =>
				/registry\.register\(\s*'([^']+)'\s*,/.exec(
					await readFile(file, 'utf8')
				)?.[1]
			)
		)
	).filter((name): name is string => Boolean(name));

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

	it('exposes every registered tool', async () => {
		const tools = await client.listTools();
		const names = new Set(tools.tools.map((t) => t.name));
		for (const tool of await registeredToolNames())
			expect(names).toContain(tool);
		expect(names.size).toBe(tools.tools.length);
	});
});