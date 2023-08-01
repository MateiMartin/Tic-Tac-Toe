'use strict'
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5173", 'https://mateimartin.github.io/Tic-Tac-Toe/']
    }
});


const PORT = process.env.PORT || 3001;
app.use(cors());

function generateRandomId() {
    const idLength = 8; // You can adjust the length as per your requirements
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let randomId = '';

    for (let i = 0; i < idLength; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        randomId += characters.charAt(randomIndex);
    }

    return randomId;
}




let rooms = [];

io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('join-room', (data) => {
        io.emit('data', data);
        let joined = false;
        for (let i = 0; i < rooms.length; i++) {
            if (io.sockets.adapter.rooms.get(rooms[i].id).size === 1) {
                socket.join(rooms[i].id);
                joined = true;
                console.log('joined ' + rooms[i].id + ' room');
                break;
            }
        }
        if (!joined) {
            const newRoomId = generateRandomId();
            rooms.push({ id: newRoomId, userData: data });
            socket.join(newRoomId);
            console.log('created ' + newRoomId + ' room');
        }
        console.log(Array.from(socket.rooms).at(-1));
        console.log(data);
        console.log(rooms.length);
    });

    socket.on('game', (data) => {
        socket.to(Array.from(socket.rooms).at(-1)).emit('game', data);
    });

    socket.on('disconnect', () => {
        let roomName = Array.from(socket.rooms)[1];
        let room = io.sockets.adapter.rooms.get(roomName);
        if (room) {
            const socketIdsInRoom = Array.from(chatRoom);
            socketIdsInRoom.forEach(socketId => {
                io.sockets.sockets[socketId].leave(roomName)
                console.log('User left room: ' + roomName);
            });
        } else {
            console.log('Chat room does not exist or is empty');
        }
        rooms.slice(rooms.indexOf(roomName), 1);
        console.log(rooms.length);
    });
});



httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

