# fb-chat-mcp

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.ts
```

This project was created using `bun init` in bun v1.3.14. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## Troubleshooting

`meta-messenger.js` depends on a native library (`messagix.so`) that is downloaded during install. If you hit `Native library not found ... Run: npm run build:go`, re-run:

```bash
rm -rf node_modules && bun install
```

or trust the package explicitly:

```bash
bun pm trust meta-messenger.js && bun install
```
