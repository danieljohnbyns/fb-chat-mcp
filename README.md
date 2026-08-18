# fb-chat-mcp

An [MCP](https://modelcontextprotocol.io) server that exposes Facebook Messenger as a tool suite for AI assistants. It connects to your Facebook account and lets MCP clients send messages, react, manage threads, share media, and use end-to-end-encrypted chats.

Runs on both **Node.js** and **Bun**.

## Tools

| Category | Tools |
| --- | --- |
| Messaging | `sendMessage`, `sendReaction`, `editMessage`, `unsendMessage`, `sendTypingIndicator`, `markAsRead` |
| Users | `getUserInfo`, `searchUsers` |
| Threads | `createThread`, `renameThread`, `deleteThread`, `muteThread`, `unmuteThread` |
| Media | `uploadMedia`, `sendImage`, `sendVideo`, `sendVoice`, `sendFile`, `sendSticker`, `setGroupPhoto` |
| E2EE | `sendE2EEMessage`, `sendE2EEReaction`, `sendE2EETyping`, `editE2EEMessage`, `unsendE2EEMessage`, `sendE2EEImage`, `sendE2EEVideo`, `sendE2EEAudio`, `sendE2EEDocument`, `sendE2EESticker`, `downloadE2EEMedia` |
| Device | `getDeviceData`, `registerPushNotifications` |

## Requirements

- **Node.js** >= 22.12 **or** **Bun** >= 1.0 (required by the `meta-messenger.js` FFI layer)
- A Facebook account with a valid session (see [Configuration](#configuration))

## Install

With npm:

```bash
npm install -g fb-chat-mcp
```

Or run without installing:

```bash
npx fb-chat-mcp
```

With bun:

```bash
bun add -g fb-chat-mcp
# or
bunx fb-chat-mcp
```

> **bun users:** bun blocks package postinstall scripts by default. The native library
> is fetched by `fb-chat-mcp`'s postinstall, so trust it (and its native dependency) first:
>
> ```bash
> bun pm trust fb-chat-mcp meta-messenger.js && bun install
> ```

## Configuration

The server needs your Facebook session cookies to connect. Point it at a cookies file with the `FB_COOKIES_PATH` environment variable:

```bash
export FB_COOKIES_PATH=/path/to/cookies.json
fb-chat-mcp
```

The file must contain the cookie **values** (not headers) for `facebook.com`:

```json
{
	"c_user": "100012345678901",
	"xs": "abcdefgh...",
	"datr": "xyz...",
	"fr": "1abc...Z"
}
```

If `FB_COOKIES_PATH` is unset, the server looks for `.tmp/cookies.json` relative to the current working directory.

To get the values: log in to facebook.com in a browser, open DevTools → Application → Cookies, and copy the `c_user`, `xs`, `datr`, and `fr` cookie values.

## Using with an MCP client

Point your MCP client at the server with stdio. Example for Claude Desktop (`claude_desktop_config.json`):

```json
{
	"mcpServers": {
		"fb-chat-mcp": {
			"command": "npx",
			"args": ["fb-chat-mcp"],
			"env": {
				"FB_COOKIES_PATH": "/absolute/path/to/cookies.json"
			}
		}
	}
}
```

With bun:

```json
{
	"mcpServers": {
		"fb-chat-mcp": {
			"command": "bunx",
			"args": ["fb-chat-mcp"],
			"env": {
				"FB_COOKIES_PATH": "/absolute/path/to/cookies.json"
			}
		}
	}
}
```

## Development

```bash
bun install          # install dependencies
bun run build        # compile src/ to Node-compatible dist/index.js
bun run test         # run the test suite
bun run lint         # prettier + eslint
```

Release a new version (bumps package.json, pushes `main`, creates `release/v*`):

```bash
bun scripts/release.ts patch   # major | minor | patch
```

A GitHub workflow publishes to npm when a `release/v*` branch is pushed.

## Troubleshooting

**`Native library not found ... Run: npm run build:go`**

The `messagix` native binary failed to download during install. Re-run the install, or fetch it explicitly:

```bash
npm install       # npm will re-run the postinstall
bun pm trust fb-chat-mcp meta-messenger.js && bun install
```

**`Cookies file not found at ...`**

Point `FB_COOKIES_PATH` at a valid cookies file (see [Configuration](#configuration)).

## License

AGPL-3.0-or-later — this project depends on `meta-messenger.js`, which is licensed under the GNU Affero General Public License v3.
