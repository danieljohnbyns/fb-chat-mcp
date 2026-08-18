import type {
	McpServer,
	ToolCallback
} from '@modelcontextprotocol/sdk/server/mcp.js';
import type {
	ZodRawShapeCompat,
	AnySchema
} from '@modelcontextprotocol/sdk/server/zod-compat.js';

type ToolConfig = {
	title?: string;
	description?: string;
	inputSchema?: ZodRawShapeCompat | AnySchema;
	outputSchema?: ZodRawShapeCompat | AnySchema;
	annotations?: Record<string, unknown>;
};

type RegisteredTool = {
	name: string;
	config: ToolConfig;
	cb: ToolCallback<any>;
};

class ToolRegistry {
	private static instance: ToolRegistry | null = null;
	private tools = new Map<string, RegisteredTool>();

	private constructor() {}

	static getInstance(): ToolRegistry {
		if (!ToolRegistry.instance) ToolRegistry.instance = new ToolRegistry();
		return ToolRegistry.instance;
	};

	register(
		name: string,
		config: ToolConfig,
		cb: ToolCallback<any>
	): RegisteredTool {
		const tool: RegisteredTool = { name, config, cb };
		this.tools.set(name, tool);
		return tool;
	};

	registerAll(server: McpServer): void {
		for (const { name, config, cb } of this.tools.values())
			server.registerTool(name, config, cb as never);
	};

	get(name: string): RegisteredTool | undefined {
		return this.tools.get(name);
	};

	has(name: string): boolean {
		return this.tools.has(name);
	};

	list(): RegisteredTool[] {
		return [...this.tools.values()];
	};

	clear(): void {
		this.tools.clear();
	};
};

export const registry = ToolRegistry.getInstance();
export default registry;
