import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { broadcastMessage, formatMessage, getFormattedMessages, getMessages, saveMessage } from '../services/messageService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'JWT-SECRET-TOKEN';

export async function handleConnection(wss, ws, req) {
  // Authentication
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies['auth-token'];

  if (!token) {
    ws.close(1008, 'Authentication required');
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    ws.user = decoded; // Attach user to socket
    ws.id = decoded._id;
  } catch (err) {
    ws.close(1008, 'Invalid token');
    return;
  }

  // Sending chat history to connected client
  let messages = await getFormattedMessages();
  ws.send(JSON.stringify(messages));
  console.log(`User connected: ${ws.user.username}`);

  ws.on('message', async (message) => {
    try {
      const result = JSON.parse(message);
      if (result.type === 'message') {
        let savedMessage = await saveMessage(ws.id, ws.user.username, result.content, result.channelId);
        broadcastMessage(wss, ws.user, result.content, savedMessage._id, result.channelId);
      }
      else if(result.type === 'activity'){
        ws.send(JSON.stringify({type: 'activity', payload: 'someone is typing'}))
      }
    } catch (error) {
      console.error('Failed to process message', error);
    }
  });

  // Handle disconnect
  ws.on('close', () => {
    console.log(`User disconnected: ${ws.user.username}`);
  });
}
