#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { messengerClient, messengerUser } from './utils/client.js';
import registry from './utils/registry.js';

import './tools/messaging/sendMessage.js';
import './tools/messaging/sendReaction.js';
import './tools/messaging/editMessage.js';
import './tools/messaging/unsendMessage.js';
import './tools/messaging/sendTypingIndicator.js';
import './tools/messaging/markAsRead.js';
import './tools/users/getUserInfo.js';
import './tools/users/searchUsers.js';
import './tools/threads/createThread.js';
import './tools/threads/renameThread.js';
import './tools/threads/muteThread.js';
import './tools/threads/unmuteThread.js';
import './tools/threads/deleteThread.js';
import './tools/media/uploadMedia.js';
import './tools/media/sendImage.js';
import './tools/media/sendVideo.js';
import './tools/media/sendVoice.js';
import './tools/media/sendFile.js';
import './tools/media/sendSticker.js';
import './tools/media/setGroupPhoto.js';
import './tools/e2ee/sendE2EEMessage.js';
import './tools/e2ee/sendE2EEReaction.js';
import './tools/e2ee/sendE2EETyping.js';
import './tools/e2ee/editE2EEMessage.js';
import './tools/e2ee/unsendE2EEMessage.js';
import './tools/e2ee/sendE2EEImage.js';
import './tools/e2ee/sendE2EEVideo.js';
import './tools/e2ee/sendE2EEAudio.js';
import './tools/e2ee/sendE2EEDocument.js';
import './tools/e2ee/sendE2EESticker.js';
import './tools/e2ee/downloadE2EEMedia.js';
import './tools/device/getDeviceData.js';
import './tools/device/registerPushNotifications.js';

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
