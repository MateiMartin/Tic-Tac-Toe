// Install the required packages: npm install express socket.io cors
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


io.on('connection', (socket) => {
    console.log(socket.id);


    socket.on('data', (data) => {
        io.emit('data', data);
        console.log(data);
    });

    socket.on('game', (data) => {
        socket.broadcast.emit('game', data);
    });

});



httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
