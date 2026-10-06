const roomHandlers = require('./roomHandlers');
const gameHandlers = require('./gameHandlers');
const roomManager = require('./RoomManager');

const handleConnection = (ws) => {
  const guestId = Math.random().toString(36).slice(2, 10);
  
  console.log(`New client connected with guestId: ${guestId}`);
  
  ws.send(JSON.stringify({ type: 'WELCOME', payload: { guestId } }));

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      console.log(`Received msg type: ${message.type} from ${guestId}`);

      switch (message.type) {
        case 'CREATE_ROOM':
          roomHandlers.handleCreateRoom(ws, message, guestId);
          break;
        case 'JOIN_ROOM':
          roomHandlers.handleJoinRoom(ws, message, guestId);
          break;
        case 'MAKE_MOVE':
          gameHandlers.handleMakeMove(ws, message, guestId);
          break;
        default:
          ws.send(JSON.stringify({ type: 'ERROR', payload: 'Unknown message type.' }));
      }
    } catch (error) {
      console.error('Error parsing message:', error);
      ws.send(JSON.stringify({ type: 'ERROR', payload: 'Invalid JSON format.' }));
    }
  });

  ws.on('close', () => {
    console.log(`Client disconnected: ${guestId}`);
    
    const roomId = roomManager.leaveRoom(ws);
    
    if (roomId && roomManager.rooms.has(roomId)) {
       roomManager.broadcast(roomId, {
           type: 'PLAYER_DISCONNECTED',
           payload: 'Your opponent disconnected.'
       });
    }
  });
};

module.exports = {
  handleConnection
};
