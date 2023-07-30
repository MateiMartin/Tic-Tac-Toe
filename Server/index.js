// Install the required packages: npm install express socket.io cors
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

const PORT = process.env.PORT || 3001;

// Use cors middleware to enable CORS for all routes
app.use(cors());
// Store active rooms and players in an object
const rooms = {};

function generateRoomId() {
    // This function generates a unique room ID using some logic (e.g., random numbers, timestamps, etc.).
    // You can customize it based on your requirements.
    return 'room_' + Math.random().toString(36).slice(2, 9);
}


io.on("connection", (socket) => {
    console.log('New user connected:', socket.id);

    // Handle when a user requests to join or create a room
    socket.on('joinOrCreateRoom', () => {
        let roomToJoin;

        // Check if there are any existing rooms with less than 2 players
        for (const roomId in rooms) {
            if (rooms[roomId].length < 2) {
                roomToJoin = roomId;
                break;
            }
        }

        // If no room is available, create a new one
        if (!roomToJoin) {
            const newRoomId = generateRoomId();
            rooms[newRoomId] = [socket.id];
            roomToJoin = newRoomId;
        } else {
            // Add the player to the existing room
            rooms[roomToJoin].push(socket.id);
        }

        // Notify the client about the room they joined or created
        socket.emit('roomJoined', roomToJoin);

        // Join the room's socket.io channel
        socket.join(roomToJoin);

        console.log('User', socket.id, 'joined room', roomToJoin);

        // Check if the room is full (2 players) and start the game or take any other appropriate actions.
        if (rooms[roomToJoin].length === 2) {
            console.log('Room', roomToJoin, 'is full. Starting the game...');
            // You can emit an event here to start the game for both players.
        }
    });
});


httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
