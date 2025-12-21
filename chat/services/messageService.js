import { WebSocket } from 'ws';
import Message from '../models/Message.js';

export function formatMessage(username, text, userId, messageId) {
  return {
    type: 'text',
    payload: {
      _id: messageId,
      content: text,
      author: {
        _id: userId,
        username: username
      },
      timestamp: new Date().toISOString()
    }
  };
}

export function broadcastMessage(wss, sender, text) {
  // Create the standard message object
  const messageObj = formatMessage(sender.username, text, sender._id);
  const jsonMessage = JSON.stringify(messageObj);

  // Broadcast to all connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(jsonMessage);
    }
  });
}

export async function saveMessage(senderId, senderUsername, content, channelId) {
  return await Message.create({
    senderId,
    senderUsername,
    content,
    channelId
  });
}

export async function getMessages(channelId) {
  return await Message.find({ channelId: channelId});
}
