'use strict'
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = http.createServer(app);
const { instrument } = require("@socket.io/admin-ui");
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5173", 'https://mateimartin.github.io/Tic-Tac-Toe', 'https://admin.socket.io']
    }
});
instrument(io, { auth: false, });

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
            if (io.sockets.adapter.rooms.get(rooms[i].id) && io.sockets.adapter.rooms.get(rooms[i].id).size === 1) {
                socket.join(rooms[i].id);
                rooms[i].user2Data = data;
                joined = true;
                console.log('joined ' + rooms[i].id + ' room');
                io.to(rooms[i].id).emit('room-info', rooms[i]);
                break;
            }
        }
        if (!joined) {
            const newRoomId = generateRandomId();
            rooms.push({ id: newRoomId, user1Data: data });
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

    socket.on('chat-message', (message, roomId, socketId) => {
        console.log(message);
        console.log(roomId);
        socket.to(roomId).emit('chat-message', message, socketId);
    });

    socket.on('room-leave', (room) => {
        // Emit 'user-disconnected' event to all players in the room
        // io.to(room.id).emit('user-disconnected');
        socket.broadcast.emit('user-disconnected');

        // Loop through each socket in the room and make them leave
        const socketsInRoom = io.sockets.adapter.rooms.get(room.id);
        if (socketsInRoom) {
            socketsInRoom.forEach((socketId) => {
                io.sockets.sockets.get(socketId).leave(room.id);
            });
        }

        // Remove the room from the 'rooms' array
        const roomIndex = rooms.findIndex((r) => r.id === room.id);
        if (roomIndex !== -1) {
            rooms.splice(roomIndex, 1);
        }

        console.log(rooms);
    });

    let resetCnt = 0;
    socket.on('toReset', (players, room) => {
        resetCnt = players;
        io.to(room.id).emit('toReset', players);
        if (resetCnt === 2) {
            resetCnt = 0;
        }



    });


    socket.on('disconnect', () => {

        for (let i = 0; i < rooms.length; i++) {

            if (rooms[i].user1Data.id === socket.id || rooms[i].user2Data.id === socket.id) {
                rooms.splice(i, 1);
                socket.to(Array.from(socket.rooms).at(-1)).emit('user-disconnected');
                break;
            }


        }
    });


});



httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});