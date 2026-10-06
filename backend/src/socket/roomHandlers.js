const roomManager = require('./RoomManager');
const gamesRegistry = require('../games');

const handleCreateRoom = (ws, message, userId) => {
  const gameName = message.payload?.game;

  if (!gameName || !gamesRegistry[gameName]) {
    return ws.send(JSON.stringify({ 
      type: 'ERROR', 
      payload: `Game '${gameName}' is not supported.` 
    }));
  }

  const gameConfig = gamesRegistry[gameName];
  const initialState = gameConfig.logic.createInitialState();
  
  const room = roomManager.createRoom(
    ws, 
    userId, 
    gameName, 
    initialState, 
    gameConfig.maxPlayers
  );

  ws.send(JSON.stringify({
    type: 'ROOM_CREATED',
    payload: { roomId: room.id, game: room.gameName, state: room.state }
  }));
};

const handleJoinRoom = (ws, message, userId) => {
  const roomId = message.payload?.roomId;
  
  if (!roomId) {
    return ws.send(JSON.stringify({ type: 'ERROR', payload: 'roomId is required to join.' }));
  }

  const result = roomManager.joinRoom(roomId, ws, userId);
  
  if (result.error) {
    return ws.send(JSON.stringify({ type: 'ERROR', payload: result.error }));
  }

  roomManager.broadcast(roomId, {
    type: 'GAME_STATE',
    payload: {
      game: result.room.gameName,
      state: result.room.state
    }
  });
};

module.exports = {
  handleCreateRoom,
  handleJoinRoom
};
