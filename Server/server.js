'use strict'
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = http.createServer(app);
const { instrument } = require("@socket.io/admin-ui");
const e = require('express');
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

    //public rooms
    socket.on('join-room', (data) => {
        io.emit('data', data);
        let joined = false;
        for (let i = 0; i < rooms.length; i++) {
            if (io.sockets.adapter.rooms.get(rooms[i].id) && io.sockets.adapter.rooms.get(rooms[i].id).size === 1) {
                if (rooms[i].private === false) {
                    socket.join(rooms[i].id);
                    rooms[i].user2Data = data;
                    joined = true;
                    console.log('joined ' + rooms[i].id + ' room');
                    io.to(rooms[i].id).emit('room-info', rooms[i]);
                    break;
                }
            }
        }
        if (!joined) {
            const newRoomId = generateRandomId();
            rooms.push({ id: newRoomId, user1Data: data, private: false });
            socket.join(newRoomId);
            console.log('created ' + newRoomId + ' room');
        }
        console.log(Array.from(socket.rooms).at(-1));
        console.log(data);
        console.log(rooms.length);
    });

    socket.on('createPrivateGame', (data) => {
        const newRoomId = generateRandomId();
        rooms.push({ id: newRoomId, user1Data: data, private: true });
        socket.join(newRoomId);
        io.to(newRoomId).emit('private-room-create', rooms[rooms.length - 1]);
    });

    socket.on('joinPrivateGame', (input, playerInfo) => {
        console.log(input);
        let thisRoom;
        for (let i = 0; i < rooms.length; i++) {
            if (rooms[i].id === input && rooms[i].private === true) {
                rooms[i].user2Data = playerInfo;
                thisRoom = rooms[i];
            }
        }
        if (thisRoom) {
            socket.join(input);
            // console.log(thisRoom)
            io.to(input).emit('private-room-join', thisRoom);
        }


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
        console.log(room)
        socket.to(room.id).emit('user-disconnected');

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

    socket.on('room-leave-private',(roomId)=>{
        console.log(roomId)
        socket.leave(roomId);
        for(let i=0;i<rooms.length;i++){
            if(rooms[i].id===roomId){
                rooms.splice(i,1);
            }
        }
        console.log(rooms)
    })

    socket.on('disconnecting', () => {
        const roomIds = Array.from(socket.rooms);

        // Ensure that there's at least one room (excluding the socket's own ID)
        if (roomIds.length <= 1) {
            console.log("Room not found in the rooms array.");
            return; // No need to continue if the socket is not in any room
        }

        // Find the index of the room in the rooms array
        const roomIndex = rooms.findIndex((r) => r.id === roomIds.at(-1));

        if (roomIndex !== -1) {
            console.log("Room found in the rooms array.")
            const disconnectedRoom = rooms[roomIndex];

            // Emit 'user-disconnected' event to other users in the room
            socket.to(disconnectedRoom.id).emit('user-disconnected');

            // Remove the disconnected room from the rooms array
            rooms.splice(roomIndex, 1);
            console.log(rooms);
        } 
    });


});



httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});