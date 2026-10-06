class RoomManager {
  constructor() {
    this.rooms = new Map(); 
    
    this.clientRooms = new Map(); 
  }

  createRoom(hostWs, hostId, gameName, initialState, maxPlayers = 2) {
    // Generate a random 5-character string
    const roomId = Math.random().toString(36).slice(2, 7).toUpperCase();
    
    const room = {
      id: roomId,
      gameName: gameName,
      maxPlayers: maxPlayers,
      players: [{ ws: hostWs, userId: hostId, seatIndex: 0 }],
      state: initialState
    };
    
    // Save it to memory
    this.rooms.set(roomId, room);
    this.clientRooms.set(hostWs, roomId);
    
    return room;
  }

  joinRoom(roomId, ws, userId) {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      return { error: 'Room not found' };
    }

    // Reconnection 
    const existingPlayerIndex = room.players.findIndex(p => p.userId === userId);
    if (existingPlayerIndex !== -1) {
       const oldWs = room.players[existingPlayerIndex].ws;
       if (oldWs) this.clientRooms.delete(oldWs);
       
       room.players[existingPlayerIndex].ws = ws;
       this.clientRooms.set(ws, roomId);
       return { success: true, room, message: 'Reconnected' };
    }
    
    // Normal Join
    if (room.players.length >= room.maxPlayers) {
      return { error: 'Room is full' };
    }
    
    const seatIndex = room.players.length;
    
    room.players.push({ ws, userId, seatIndex });
    this.clientRooms.set(ws, roomId);
    
    return { success: true, room };
  }

  broadcast(roomId, message) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    
    const payload = JSON.stringify(message);
    
    for (const player of room.players) {
      if (player.ws && player.ws.readyState === 1) {
        player.ws.send(payload);
      }
    }
  }

  leaveRoom(ws) {
    const roomId = this.clientRooms.get(ws);
    if (!roomId) return null;

    const room = this.rooms.get(roomId);
    if (room) {
      const player = room.players.find(p => p.ws === ws);
      if (player) player.ws = null;

      const allDisconnected = room.players.every(p => p.ws === null);
      if (allDisconnected) {
        this.rooms.delete(roomId);
      }
    }
    
    this.clientRooms.delete(ws);
    return roomId;
  }
}

module.exports = new RoomManager();
